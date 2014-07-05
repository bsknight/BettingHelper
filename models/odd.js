var mongodb = require('./db');

function Odd(odd) {
    this.term_id = odd.term_id
    this.team = odd.team;
    this.detail = odd.detail;
    this.prefer = odd.prefer;
};

module.exports = Odd;

Odd.prototype.save = function(callback) {
    var odd = {
        term_id: this.term_id,
        team: this.team,
        detail: this.detail,
        prefer: this.prefer
    };
	mongodb.save('odds', odd, function(err) {
		if (err) {
			//console.log('Odd.prototype.save(): mongodb.save() error');
			return callback(err);
		}
		callback(null);
	});
};


//读取用户信息
Odd.get = function(id, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('odd', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //查找用户名（name键）值为 name 一个文档
      collection.findOne({
        name: name
      }, function (err, odd) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err 信息
        }
        callback(null, odd[0]);//成功！返回查询的用户信息
      });
    });
  });
};