var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

//连接数据库
function connect(callback){
	MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
	    if (err) throw err;
	   callback(db);
	});
}
//增
module.exports.insert=function(dbase,col,myobj,resp){
	connect(function(db){
		// b.db(a)数据文件b下的数据库a
		var dbo = db.db(dbase);
		if(!(myobj instanceof Array)){
			myobj=[myobj];
		}
		console.log(myobj)
	    dbo.collection(col).insertMany(myobj, function(err, res) {
	        if (err) throw err;
	        console.log(res)
	        db.close();
	        resp.send(res)
	    });
	})
}
//查
module.exports.find=function(dbase,col,myobj,resp,sort={},skip=0,limit=0){
	connect(function(db){
		var dbo = db.db(dbase);

		dbo.collection(col).find(myobj).sort(sort).skip(skip).limit(limit).toArray(function(err, result) { // 返回集合中所有数据
	        if (err) throw err;
	        db.close();
	        resp.send(result)
	    });
	})
}
//删
module.exports.delete=function(dbase,col,myobj,resp,flag=true){
	connect(function(db){
		var dbo = db.db(dbase);
		if(flag){
			dbo.collection(col).deleteOne(myobj, function(err, obj) {
				if (err) throw err;
				db.close();
		        // resp.send({
		        // 	msg:1
				// })
		    });
		}else{
			dbo.collection(col).deleteMany(myobj, function(err, obj) {
		        if (err) throw err;
		        db.close();
		        resp.send({
		        	msg:1
		        })
		    });
		}
	})
}
// 改
module.exports.update=function(dbase,col,myobj,updateObj,resp,flag=true){
	connect(function(db){
		var dbo = db.db(dbase);
		if(flag){
			dbo.collection(col).updateOne(myobj, updateObj,function(err, obj) {
		        if (err) throw err;
		        db.close();
		        resp.send({
		        	msg:1
		        })
		    });
		}else{
			dbo.collection(col).updateMany(myobj,updateObj, function(err, obj) {
		        if (err) throw err;
		        db.close();
		        resp.send({
		        	msg:1
		        })
		    });
		}
		
	})
}

// 尝试用promise,callback