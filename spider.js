var request = require('request');
var cheerio = require('cheerio');
var zlib = require('zlib');
var debug = require('debug')('spider');

var Odd = require('./models/odd.js');
var NineGames = require('./models/nineGames.js');	
var BetStrategy = require('./models/betStrategy.js');	
var Schedule = require('./models/schedule.js');	
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
                    return callback(err);
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
                return callback(null, articleList);                   
            });               
        }else {
            console.log('error code:'+res.statusCode);
            return callback(err);
        }
    }); 
};

exports.saveObject = function(objectArray, callback) {
    for (i in objectArray) {
    //console.log(oddsArray[i]);
        
        objectArray[i].save(function(err, res) {
            if(err) 
            {
                return callback(err);
            }
            //console.log(res);
			return callback(null);
        });
        
     }
     
    //Odd.closeDB();
    return callback(null);
}

//得到赔率
exports.getArticleOdds = function(url, term, callback) {
    debug('getArticle');
    options_get.url = 'http://'+options_get.headers['Host']+url;
    //console.log(options_get);
    request.get(options_get, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            zlib.unzip(body, function(err, str){
                if(err) {
                    console.log('unzip error code:'+res.statusCode);
                    return callback(err);
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
                
                return callback(null, oddsArray);
            });           
        }else {
            console.log('request error code:'+res.statusCode);
            return callback(err);
        }
    });     
}

//得到任选九场推荐
exports.getArticleNineGames = function(url, term, callback) {
    options_get.url = 'http://'+options_get.headers['Host']+url;
    //console.log(options_get);
    request.get(options_get, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            zlib.unzip(body, function(err, str){
                if(err) {
                    console.log('unzip error code:'+res.statusCode);
                    return callback(err);
                }
                html = str.toString();
                var $ = cheerio.load(html);
				//console.log(html);
                
                var i,count=0;
                var nineGamesArray = [];
                var item = {};
				
                //一行6栏 14行
                var filter = 'table tr td';
                for(i=6; i<118; i+=8) {  
                    var id = $(filter).eq(i).text();
                    item.term_id = term+'-'+id;
                    item.team = $(filter).eq(i+1).text()+' '+$(filter).eq(i+2).text()+' '+$(filter).eq(i+3).text();                    
                    item.select = $(filter).eq(i+4).text();
					item.detail = $(filter).eq(i+5).text();
                    item.prefer = $(filter).eq(i+6).text()+' '+$(filter).eq(i+7).text();
                    
					//console.log(item);
					
					
                    var nineGames = new NineGames ({
                        term_id: item.term_id,
                        team: item.team,
						select: item.select,
                        detail: item.detail,
                        prefer: item.prefer                        
                    });
                    nineGamesArray.push(nineGames);
					
				}  
                
                return callback(null, nineGamesArray);
            });           
        }else {
            console.log('request error code:'+res.statusCode);
            return callback(err);
        }
    });   	
}

//得到投注策略
exports.getArticBetStrategy = function(url, term, callback) {
    options_get.url = 'http://'+options_get.headers['Host']+url;
    //console.log(options_get);
    request.get(options_get, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            zlib.unzip(body, function(err, str){
                if(err) {
                    console.log('unzip error code:'+res.statusCode);
                    return callback(err);
                }
                html = str.toString();
                var $ = cheerio.load(html);
				//console.log(html);
                
                var i,count=0;
                var betArray = [];
                var item = {};
				
                //一行6栏 14行
                var filter = 'table tr td';
                for(i=5; i<75; i+=5) {  
                    var id = $(filter).eq(i).text();
                    item.term_id = term+'-'+id;
                    item.team = $(filter).eq(i+1).text();                    
                    item.type = $(filter).eq(i+2).text();
					item.detail = $(filter).eq(i+3).text();
                    item.prefer = $(filter).eq(i+4).text();
                    
					//console.log(item);
					
                    var bet = new BetStrategy ({
                        term_id: item.term_id,
                        team: item.team,
						type: item.type,
                        detail: item.detail,
                        prefer: item.prefer                        
                    });
                    betArray.push(bet);
					
				}  
                
                return callback(null, betArray);
            });           
        }else {
            console.log('request error code:'+res.statusCode);
            return callback(err);
        }
    });   	
}

//得到投注策略
exports.getArticSchedule = function(url, term, callback) {
    options_get.url = 'http://'+options_get.headers['Host']+url;
    //console.log(options_get);
    request.get(options_get, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            zlib.unzip(body, function(err, str){
                if(err) {
                    console.log('unzip error code:'+res.statusCode);
                    return callback(err);
                }
                html = str.toString();
                var $ = cheerio.load(html);
				//console.log(html);
                
                var i,count=0;
                var scheduleArray = [];
                var item = {};
				
                //一行6栏 14行
                var filter = 'table tr td';
                for(i=5; i<75; i+=5) {  
                    var id = $(filter).eq(i).text();
                    item.term_id = term+'-'+id;
                    item.team = $(filter).eq(i+1).text();                    
                    item.recent = $(filter).eq(i+2).text();
					item.schedule = $(filter).eq(i+3).text();
                    item.prefer = $(filter).eq(i+4).text();
                    
					//console.log(item);
					
					
                    var schedule = new Schedule ({
                        term_id: item.term_id,
                        team: item.team,
						recent: item.recent,
                        schedule: item.schedule,
                        prefer: item.prefer                        
                    });
                    scheduleArray.push(schedule);
					
				}  
                
                return callback(null, scheduleArray);
            });           
        }else {
            console.log('request error code:'+res.statusCode);
            return callback(err);
        }
    });   	
}

