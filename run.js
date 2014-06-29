var spider = require('./spider');
var async = require('async');  
var url = 'http://zx.aicai.com/news/newsmessage!newsSort.jhtml?shorturl=sfc';
var term = 14083;
var articleList=[];
var odds=[];
/*
                    odd.save(function(err, odd) {
                        if(err)
                        {
                            console.log('error code:'+res.statusCode);
                            return callback(err);
                        }
                        console.log(i);
                    });
                    
                    
                    

                    */
async.series([

    function(callback) {
        spider.getArticleList(url, term, function(err, list) {
            if(err) {
                //console.log('err');
                throw err;
            }
            console.log(list);
            articleList = list;
            //console.log(articleList);
            //return articleList;
            callback(null, list)
        });       
    },
    
    function(callback) {
        var i;
        for(i in articleList)
        {
            //console.log(articleList[i].name);
            //\u671F\u8DB3\u5F69\u5927\u52BF = 期足彩大势
            //\u671f\u8d54\u7387\u5206\u6790 = 期赔率分析
            
            var tmp = articleList[i].name.match(/\u80DC\u8D1F\u5F69\d+\u671f\u8d54\u7387\u5206\u6790.*/);
            if(Array.isArray(tmp))
            {
                //console.log(list[i].url);
                spider.getArticleOdds(articleList[i].url, term, function(err, oddArray) {
                    if(err) throw err;
                    //console.log(oddArray);
                    odds = oddArray;
                    callback(null, oddArray);
                });
            }
        }
    },
    
    function(callback) {
        spider.saveArticlueOdds(odds, function(err){
            if(err) throw err;
            callback(null);
        
        });
        
    }
    
    /*
    funcion(callback) {
        spider.saveArticleList()
    }
    */
    

], function(err, results) {
    if(err)
        console.log(err);
    //process.exit(0);
});



    