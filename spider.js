var request = require('request');
var cheerio = require('cheerio');
var zlib = require('zlib');
var debug = require('debug')('spider');

Odd = require('./models/odd.js');
//var articleList = [];

var options_post = {
    headers: {
        'Host': 'zx.aicai.com',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36',
        'Accept-Encoding': 'gzip',
        'Accept-Language': 'zh-CN,zh;q=0.8',
    },
    form: {
        sortIndex: '1001'
    },
    encoding: null
};

var options_get = {
    headers: {
        'Host': 'zx.aicai.com',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36',
        'Accept-Encoding': 'gzip',
        'Accept-Language': 'zh-CN,zh;q=0.8',
    },
    encoding: null
};

exports.getArticleList = function(url, term, callback) {   
    debug('getArticleList');
    options_post.url = url;
    request.post(options_post, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            zlib.unzip(body, function(err, str){
                if(err) {
                    console.log('error code:'+res.statusCode);
                    callback(err);
                }    
                
                html = str.toString();
                var $ = cheerio.load(html);
                
                var articleList = [];
                $('.yucenews li a').each(function () {
                    var $me = $(this);
                    var item = {
                        name: $me.text().trim(),
                        url:  $me.attr('href')
                    };
                    // \u80DC\u8D1F\u5F69 = 胜负彩   [\u4E00-\u9FA5\uF900-\uFA2D] 中文编码范围
                    var s = item.name.match(/\u80DC\u8D1F\u5F69(\d+)[\u4E00-\u9FA5\uF900-\uFA2D]+.*/);
                    if (Array.isArray(s) && s[1] == term) {
                        articleList.push(item);
                    }                
                    
                });   
                // 返回结果
                callback(null, articleList);                   
            });               
        }else {
            console.log('error code:'+res.statusCode);
            callback(err);
        }
    }); 
};

//得到赔率
exports.getArticleOdds = function(url, term, callback) {
    debug('getArticle');
    options_get.url = 'http://'+options_get.headers['Host']+url;
    //console.log(options_get);
    request.get(options_get, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            zlib.unzip(body, function(err, str){
                if(err) {
                    console.log('error code:'+res.statusCode);
                    callback(err);
                }
                html = str.toString();
                var $ = cheerio.load(html);
                
                var i,count=0;
                var oddsArray = [];
                var item = {};
                item.term = term;
                //一行8栏 14行
                var filter = 'table tr td';
                for(i=1; i<=112; i+=8) {  
                    var id = $(filter).eq(i+5).text();
                    item.term_id = term+'-'+id;
                    item.team = $(filter).eq(i+6).text()+' '+$(filter).eq(i+7).text()+' '+$(filter).eq(i+8).text();                    
                    item.detail = $(filter).eq(i+9).text();
                    item.prefer = $(filter).eq(i+10).text()+' '+$(filter).eq(i+11).text()+' '+$(filter).eq(i+12).text();
                    
                    var odd = new Odd ({
                        term_id: item.term_id,
                        team: item.team,
                        detail: item.detail,
                        prefer: item.prefer                        
                    });
                    oddsArray.push(odd);
                }  
                
                callback(err, oddsArray);
            });           
        }else {
            console.log('error code:'+res.statusCode);
            callback(err);
        }
    });     
}

exports.saveArticlueOdds = function(oddsArray, callback) {
    for (i in oddsArray) {
    //console.log(oddsArray[i]);
        
        oddsArray[i].save(function(err, res) {
            if(err) 
            {
                console.log('err');
                throw err;
            }
            console.log(res);
            //console.log('save:\n');
            //console.log(oddsArray[i]);
        });
        
     }
     
    //Odd.closeDB();
    callback(null);
}