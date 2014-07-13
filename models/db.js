var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
    
db = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT), {safe:true});

db.open(function(err,db) {
    if(err)throw err;
    console.log("mongodb connected");
    return;
});

db.save = function(collection, object, callback) {
    db.collection(collection, function (err, collection) {
        if (err) {
			console.log('mongodb.collecton() error');
            return callback(err);//错误，返回 err 信息
        }
        collection.ensureIndex({term_id:1}, {unique:true}, function(err) {
            if (err) return callback(err);
            collection.insert(object, {safe: true}, function (err, object) {
                if (err) {
                    //console.log('collection.insert() error');
					if(err.code != 11000)
						console.log(err);
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, object);//成功！err 为 null，并返回存储后的用户文档
            });
        });	
    });
};	
module.exports = db;

/*
Odd.openDB = function() {
    mongodb.open(function(err,db){
        if(err)throw err;
        console.log("mongodb connected");
        return;
    });    
}

Odd.closeDB = function() {
    mongodb.close();
}
*/
