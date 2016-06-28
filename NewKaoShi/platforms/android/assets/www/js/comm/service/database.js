//本地数据库处理
/**
 *数据库操作辅助类,定义对象、数据操作方法都在这里定义
 */
var DataBase = function() {
	this.options = {
		dbname: 'khddb',
		version: '1.0',
		dbdesc: 'khddb',
		dbsize: 30000,
		db: null,
			table_UserMessage: 'tb_ExamTypes',
		//增加type区分公告与一般聊天
		UserMessage: ["ExamTypeID", "ExamTypeName", "ParentID"],
		//登陆用户表
		table_CurrentUsers: 'tb_Papers',
		CurrentUsers: ["PaperID","PaperContent","ExamTypeID", "PaperTypeID", "TotalScore", "ItemNum", "UserCount", "Status", "PassMark", "UpLoaderID", "TotalTime", "Year","ContainQuestionTypes","CreateTime","CreatorID","UpdateTime","UpdaterID"],
		//企业人员表
		table_FrontUsers: 'tb_Question',
		FrontUsers: ["id", "paperId", "c_key","q_key", "pq_key",  "questionContent", "questionIndex", "questionType", "soure","optionContent","answer","analysis","version"],

		//人员角色关系表：RoleName为角色名
		table_UserRoles: 'tb_Account',
		UserRoles: ["ID", "Name", "NickName", "IsVip","IsLogin"],

		//部门表：ParentID为父级部门ID;
		table_Departments: 'tb_UserQuestions',
		Departments: ["ID","PaperID","QuestionID", "UserID", "Type","IsSync"],
		//项目表
		table_Projects: 'tb_History',
		//Roles项目角色,Departments设计部门ID
		Projects: ["ID", "PaperID", "UserID", "Time", "Soure", "Content","Type","IsEnd","IsSync"],
		}
}
DataBase.prototype = {
	OpenDB: function(callback) {
		try {
			if (!window.openDatabase) {
				alert('该浏览器不支持数据库');
				return false;
			}
			this.options.db = window.openDatabase(this.options.dbname, this.options.version, this.options.dbdesc, this.options.dbsize);
			return true;
		} catch (e) {
			if (e == 2) {
				alert("数据库版本无效");
			} else {
				alert("数据库未知错误 " + e + ".");
			}
			alert("数据库错误" + e.message);
			return false;
		}
	},
	ExecSql: function(tx, sql, param, callback) {
		tx.executeSql(sql, param, function(tx, result) {
			if (typeof(callback) == 'function') {
				callback(true);
			}
			return true;
		}, function(tx, error) {
			if (typeof(callback) == 'function') {
				callback(false);
			}
			return false;
		});
	},
	InitDB: function(tx) {
		if (this.options.db == null) {
			this.OpenDB();
		}
		this.CreateTable(tx, this.options.table_UserMessage, this.options.UserMessage, {
			"ExamTypeID": "primary key"
		});
		this.CreateTable(tx, this.options.table_CurrentUsers, this.options.CurrentUsers, {
			"PaperID": "primary key",
		});
		this.CreateTable(tx, this.options.table_FrontUsers, this.options.FrontUsers, {
			"id": "primary key",
			"app_flow_no": "not null"
		});
		this.CreateTable(tx, this.options.table_UserRoles, this.options.UserRoles, {
			"ID":"primary key",
		});
		this.CreateTable(tx, this.options.table_Departments, this.options.Departments, {
			"ID": "primary key",
			"app_flow_no": "not null"
		});
		this.CreateTable(tx, this.options.table_Projects, this.options.Projects, {
			"ID": "primary key",
			"app_flow_no": "not null"
		});
	},
	CreateTable: function(tx, tableName, fields, constraint) {

		if (this.options.db == null) {
			this.OpenDB();
		}
		var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (';
		for (i in fields) {
			var key = "";
			if (typeof(constraint) != "undefined" && typeof(constraint[fields[i]]) != "undefined") {
				key = " " + constraint[fields[i]];
			}
			sql += fields[i] + key + ",";
		}
		sql = sql.substr(0, sql.length - 1);
		sql += ")";
		//log(sql);
		this.ExecSql(tx, sql);
	},
	UpdateTable: function(tx, tableName, setFields, setParams, whereStr, wherParams, callback) {
		var sql = "update " + tableName + " set ";
		for (i in setFields) {
			sql += setFields[i] + "=?,";
		}
		sql = sql.substr(0, sql.length - 1);
		if (typeof(whereStr) != "undefined" && typeof(wherParams) != "undefined" && whereStr != "") {
			sql += " where " + whereStr;
			setParams = setParams.concat(wherParams);
		}
		this.ExecSql(tx, sql, setParams, callback);
	},
	InsertTable: function(tx, tableName, insertFields, insertParams, callback) {
		var sql = "insert into " + tableName + " (";
		var sql2 = " values(";
		for (i in insertFields) {
			sql += insertFields[i] + ",";
			sql2 += "?,"
		}
		sql = sql.substr(0, sql.length - 1);
		sql2 = sql2.substr(0, sql2.length - 1);
		sql += ")";
		sql2 += ")";
		if (typeof(callback) == 'function')
			this.ExecSql(tx, sql + sql2, insertParams, callback);
		else
			this.ExecSql(tx, sql + sql2, insertParams);
	},
	DeleteTable: function(tx, tableName, whereStr, wherParams, callback) {
		var sql = "delete from " + tableName;
		if (typeof(whereStr) != "undefined" && typeof(wherParams) != "undefined" && whereStr != "") {
			sql += " where " + whereStr;
		}
		this.ExecSql(tx, sql, wherParams, callback);
	},
	DropTable: function(tx, tableName, callback) {
		var sql = 'DROP TABLE IF EXISTS ' + tableName;
		if (typeof(whereStr) != "undefined" && typeof(wherParams) != "undefined" && whereStr != "") {
			sql += " where " + whereStr;
		}
		this.ExecSql(tx, sql, [], callback);
	},
	//@sql:"select * from tb_UserMessage join tb_FrontUsers on tb_UserMessage.UserID=tb_FrontUsers.UserID where UserID=? order by UserID DESC"
	SelectTable: function(tx, sql, wherParams, callback,params) {
		tx.executeSql(sql, wherParams, function(tx, result) {
			if (result.rows.length < 1) {
				if (typeof(callback) == 'function') {
					callback(false,params);
				}
			} else {
				if (typeof(callback) == 'function') {
					callback(result.rows,params);
				}
			}
			return true;
		}, function(tx, error) {
			return false;
		});
	},
	SaveOrUpdateTable: function(tx, tableName, insertFields, insertParams, key, keyVal, callback) {
		var me = this;
		if (typeof(key) != "undefined" && typeof(keyVal) != "undefined" && key != "") {
			var sql = "SELECT " + insertFields[0] + " FROM " + tableName;
			if (typeof(key) != "undefined" && typeof(keyVal) != "undefined" && key != "") {
				sql += " where " + key + "=?";
			}
			me.SelectTable(tx, sql, [keyVal], function(rows) {
				if (rows) {
					me.UpdateTable(tx, tableName, insertFields, insertParams, key + "=?", [keyVal], callback);
				} else {
					insertFields.push(key);
					insertParams.push(keyVal);
					me.InsertTable(tx, tableName, insertFields, insertParams, callback);
				}
			})
		} else {
			me.InsertTable(tx, tableName, insertFields, insertParams, callback);
		}
	},
	//添加一个事务
	OpenTransaction: function(callback) {
		if (this.options.db == null) {
			this.OpenDB();
		}
		this.options.db.transaction(function(tx) {
			callback(tx); //执行数据操作
		})
	},
	//人员关系角色
	SaveOrUpdateUerRoleTable: function(tx, tableName, insertFields, insertParams, key, keyVal, callback) {
		var me = this;
		if (typeof(key) != "undefined" && typeof(keyVal) != "undefined" && key != "") {
			var sql = "SELECT " + insertFields[0] + " FROM " + tableName;
			if (typeof(key) != "undefined" && typeof(keyVal) != "undefined" && key != "") {
				sql += " where " + key;
			}
			me.SelectTable(tx, sql, keyVal, function(rows) {
				if (rows) {
					me.UpdateTable(tx, tableName, insertFields, insertParams, key, keyVal, callback);
				} else {
					me.InsertTable(tx, tableName, insertFields, insertParams, callback);
				}
			})
		} else {
			me.InsertTable(tx, tableName, insertFields, insertParams, callback);
		}
	}
}