var spider = require('./spider');
var async = require('async');  
var URL = 'http://zx.aicai.com/news/newsmessage!newsSort.jhtml?shorturl=sfc';
var TERM = 14085;
var g_articleList=[];
var g_odds=[];
var g_nineGames=[];
var mongodb = require('./models/db');

getInfomation = function(callback) {
	// get article list
	spider.getArticleList(URL, TERM, function(err, list) {
	    if(err) {
	        console.log('spider.getArticleList() error');
	    	return callback(err);
		}
	    g_articleList = list;
		console.log('Get the article list');
		
		//并发读取各文章
		async.parallel([	
	
		    // get odds
		    function(callback) {
		        var i;
		        for(i in g_articleList)
		        {
		            //\u671f\u8d54\u7387\u5206\u6790 = "赔率分析"      
		            var tmp = g_articleList[i].name.match(/\u80DC\u8D1F\u5F69\d+\u671f\u8d54\u7387\u5206\u6790.*/);
		            if(Array.isArray(tmp))
		            {
						console.log('Get odds');
		                //console.log(list[i].url);
		                spider.getArticleOdds(g_articleList[i].url, TERM, function(err, oddArray) {
		                    if(err) {
								console.log('spider.getArticleOdds() error');
		                    	return callback(err);
							}
							//console.log(oddArray);
		                    g_odds = oddArray;
							callback(null, oddArray);
		                });
		            }
		        }
		    },

			//得到任选九场推荐
		    function(callback) {
		        var i;
		        for(i in g_articleList)
		        {
					//\u4efb\u9009\u4e5d\u573a "任选九场"
		            var tmp = g_articleList[i].name.match(/\u80DC\u8D1F\u5F69\d+\u671f\u4efb\u9009\u4e5d\u573a.*/);
					//console.log(tmp);
		            if(Array.isArray(tmp))
		            {
						console.log('Get nine games');
		                //console.log(list[i].url);
		                spider.getArticleNineGames(g_articleList[i].url, TERM, function(err, nineGamesArray) {
		                    if(err) {
								console.log('spider.getArticleOdds() error');
		                    	return callback(err);
							}
							//console.log(oddArray);
		                    g_nineGames = nineGamesArray;
							callback(null, nineGamesArray);
		                });
		            }
		        }
		    }



		], function(err, array) {
		    if(err) {
		        return console.log(err);
			}
	
			console.log("Save data");
			for(i in array) {
			    spider.saveObject(array[i], function(err){
			        if(err) {
						if(err.code != 11000)
							return console.log(err.err);
			        };
			    }); 
			}
		});			
	});	  	
}

getInfomation();


  

    