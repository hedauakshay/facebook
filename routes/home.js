var ejs = require("ejs");
var mysql = require('./mysql');
var ses_email;
var ses_pwd;
var ses_fname;

function signin(req,res) {

	ejs.renderFile('./views/signin.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
}


function afterSignIn(req,res)
{
	
	console.log(req.param("inputUsername"));
	//check if session exists
	if(req.session.username)
	{
			//res.send("Found");
			var data = {};
			data["emailid"] = req.session.username;
			ses_email = req.session.username;
			data["password"] = req.session.password;
			ses_pwd = req.session.password;
			console.log(data);
			//var getUser="select * from users, user_overview where emailid='"+req.session.username+"' and password='" + req.session.password +"'";
			var getUser="SELECT * from users, user_overview WHERE users.emailid='"+req.session.username+"' and user_overview.password='"+req.session.password+"'";
			var getUser2="select fname, lname from users where emailid = (Select DISTINCT f_emailid from fb.friends where flag = 1 and emailid = '"+req.session.username+"' )";
			var getUser3="SELECT fname, lname from users where emailid IN (select DISTINCT f_emailid from friends where emailid = '"+req.session.username+"' and flag = 3)";
			var getUser4="SELECT * from fb.group where group.g_name= '"+req.session.username+"'";
			var getRes="SELECT * FROM fb.group where flag = 1 and g_name <> '"+req.session.username+"'";
			console.log("Query is:"+getUser);
			
			mysql.fetchData(function(err,results3){
				if(err){
					throw err;
				}
				else 
				{
			console.log("Query is:"+getUser);
			
			mysql.fetchData(function(err,results2){
				if(err){
					throw err;
				}
				else 
				{
			
			mysql.fetchData(function(err,results){
				if(err){
					throw err;
				}
				else 
				{
					mysql.fetchData(function(err,results4){
						if(err){
							throw err;
						}
						else 
						{
							mysql.fetchData(function(err,results5){
								if(err){
									throw err;
								}
								else 
								{
									if(results3.length > 0){
										ejs.renderFile('./views/s_login.ejs', { data: results3,data2: results2, data3:results, data4:results4, data5:results5 } , function(err, result) {
									        // render on success
									        if (!err) {
									            res.end(result);
									        }
									        // render or error
									        else {
									            res.end('An error occurred 1');
									            console.log(err);
									        }
									    });
									}
								}
							}, getRes);
						}
					},getUser4);
				}
			},getUser3);
				}
			
				},getUser2);
			
				}
			},getUser);
					
					
			/*ejs.renderFile('./views/s_login.ejs', { data: data } , function(err, result) {
		        // render on success
		        if (!err) {
		            res.end(result);
		        }
		        // render or error
		        else {
		            res.end('An error occurred');
		            console.log(err);
		        }
		    });*/
			
	}
	else
	{
		// check user already exists
		//console.log(req.param("inputUsername"));
		//console.log(req.param("inputPassword"));
		//var getUser="select * from users, user_overview where emailid='"+req.param("inputUsername")+"' and password='" + req.param("inputPassword") +"'";
		var getUser="SELECT * FROM user_overview,users where users.emailid='"+req.param("inputUsername")+"' and users.password='" + req.param("inputPassword") +"' and user_overview.emailid='"+req.param("inputUsername")+"'";
		var getUser2="select fname, lname, emailid from users where emailid in (Select DISTINCT f_emailid from fb.friends where flag = 1 and emailid = '"+req.param("inputUsername")+"' )";
		var getUser3="SELECT fname, lname from users where emailid in (select DISTINCT f_emailid from friends where emailid = '"+req.param("inputUsername")+"' and flag = 3)";
		var getUser4="SELECT * from fb.group where group.g_name='"+req.param("inputUsername")+"'";
		var getRes="SELECT * FROM fb.group where flag = 1 and g_name <> '"+req.param("inputUsername")+"'";
		//var getRes="SELECT * FROM fb.group where flag <> 0 and _name in (select f_name)"
		console.log("Query is:"+getUser);
		
		mysql.fetchData(function(err,results3){
			if(err){
				throw err;
			}
			else 
			{
		
		mysql.fetchData(function(err,results2){
			if(err){
				throw err;
			}
			else 
			{
				console.log(results2);
				mysql.fetchData(function(err,results){
					if(err){
						
						throw err;
					}
					else 
					{
						mysql.fetchData(function(err,results4){
							if(err){
								throw err;
							}
							else 
							{
								mysql.fetchData(function(err,results5){
									if(err){
										throw err;
									}
									else 
									{
										console.log(results2.length+" i need dis");
										if(results3.length > 0){
											console.log(results3);
											//Session Initialization - S
											var username, password;
											username = req.param("inputUsername");
											password = req.param("inputPassword");
											
											var json_responses;
											
											if(username!== ''  && password!== '')
											{
												//Assigning the session
												console.log("Code is here"+username+password);
												req.session.username = username;
												ses_email = username;
												req.session.password = password;
												ses_pwd = password;
												//ses_fname = results2[0].fname;
												console.log("Session initialized");
												json_responses = {"statusCode" : 200};
												//res.send(json_responses);
												
											}
											else
											{
												json_responses = {"statusCode" : 401};
												//res.send(json_responses);
											}
											//Session Init - E
											
											console.log("valid Login");
											ejs.renderFile('./views/s_login.ejs', { data: results3,data2: results2, data3:results, data4:results4, data5:results5 } , function(err, result) {
										        // render on success
										        if (!err) {
										        	//req.session.fname = results[0].fname;
										        	//ses_fname = req.session.fname;
										        	//console.log(req.session.fname);
										            res.end(result);
										        }
										        // render or error
										        else {
										            res.end('An error occurred2');
										            console.log(err);
										        }
										    });
										}
										else {    
											
											console.log("Invalid Login");
											ejs.renderFile('./views/f_login.ejs',function(err, result) {
										        // render on success
										        if (!err) {
										            res.end(result);
										        }
										        // render or error
										        else {
										            res.end('An error occurred');
										            console.log(err);
										        }
										    });
										}
									}
								},getRes);
							}
						},getUser4);
					}  
				},getUser3);
		

			}
		},getUser2);
			
			}
		},getUser);
		
		
	}
}

function getAllUsers(req,res)
{
	var getAllUsers = "select * from users";
	console.log("Query is:"+getAllUsers);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				
				var rows = results;
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				
				console.log("Results Type: "+(typeof results));
				console.log("Result Element Type:"+(typeof rows[0].emailid));
				console.log("Results Stringify Type:"+(typeof jsonString));
				console.log("Results Parse Type:"+(typeof jsString));
				
				console.log("Results: "+(results));
				console.log("Result Element:"+(rows[0].emailid));
				console.log("Results Stringify:"+(jsonString));
				console.log("Results Parse:"+(jsonParse));
				
				ejs.renderFile('./views/s_login.ejs',{data:jsonParse},function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
			else {    
				
				console.log("No users found in database");
				ejs.renderFile('./views/f_login.ejs',function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
		}  
	},getAllUsers);
}

exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};

exports.edit = function(req,res)
{
	console.log(ses_email);
	console.log(ses_pwd);
	/*res.render('edit', {
	    title: 'Edit'
	  });*/
	
	var getUser="SELECT * FROM users INNER JOIN user_overview ON users.emailid = user_overview.emailid where user_overview.emailid='"+req.session.username+"'";
	console.log("Query is:"+getUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				ejs.renderFile('./views/edit.ejs', { data: results } , function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
		}
	},getUser);
	
};

exports.edit_done = function(req,res)
{
	var work = req.body.work;
	var edu = req.body.edu;
	var mobile = req.body.mobile;
	
	var getUser="UPDATE user_overview SET work='"+work+"', edu='"+edu+"', cont='"+mobile+"' WHERE emailid='"+req.session.username+"'";
	console.log("Query is:"+getUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.redirect('/afterSignIn');
		}
	},getUser);
};

exports.register = function(req, res){
	var fname = req.body.fname;
	var lname = req.body.lname;
	var mobile = req.body.mobile;
	var email = req.body.email;
	var email2 = req.body.email2;
	var pwd = req.body.pwd;
	var pwd2 = req.body.pwd2;
	var gend = req.body.gender;
	//console.log(gend);
	/*if(pwd == pwd2)
		{
			res.redirect('/');
		}else{
			res.send("Invalid password");
		}
	*/
	if((fname===''&&lname===''&&mobile===''&&email===''&&pwd===''&&gend==='') && (pwd===pwd2 && email===email2))
	{
		res.send(500,'showAlert');		
	}else{
		var register = "INSERT INTO users (emailid, password, fname, lname, mobile, gender) VALUES ('"+email+"', '"+pwd+"', '"+fname+"', '"+lname+"', '"+mobile+"', '"+gend+"');";
		var register2 = "INSERT INTO user_overview (emailid, password) VALUES ('"+email+"', '"+pwd+"');";
		//console.log(register);
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				mysql.fetchData(function(err,results2){
					if(err){
						throw err;
					}
					else 
					{
						res.redirect("/");
						console.log(results+"  "+results2);
					}
				},register2);
			}
		},register);
	}
	
};

exports.add_friend = function(req,res)
{
	//var getUser="SELECT emailid FROM fb.friends where emailid<>'"+ses_email+"';";
	var getUser="SELECT users.emailid, users.fname, users.lname FROM fb.users where users.emailid<>'"+ses_email+"';";
	console.log("Query is:"+getUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				ejs.renderFile('./views/add_friend.ejs', { data: results } , function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
		}
	},getUser);
};

exports.frnd_req = function(req,res)
{
	//res.redirect("/");
	console.log(req.body.id2);
	var getRes="UPDATE fb.friends set flag = 3 WHERE ((emailid = '"+req.session.username+"' and flag = 1) or (emailid = '"+req.body.id2+"' and flag = 0));"
	mysql.fetchData(function(err,results){
		if(err){
			res.send("Friend req sent or already added");
			throw err;
		}
		else{
			res.redirect("/afterSignIn");
		}
	},getRes);
};

exports.frnd_func = function(req,res)
{
	console.log(req.body.id);
	var getUser="INSERT into friends (emailid, flag, f_emailid) VALUES ('"+ses_email+"', 0, '"+req.body.id+"')";
	var getUser2="INSERT into friends (emailid, flag, f_emailid) VALUES ('"+req.body.id+"', 1, '"+ses_email+"')";
	console.log("Query is:"+getUser);
	//console.log(ses_email+" "+ses_fname+" "+ses_pwd);
	mysql.fetchData(function(err,results1){
		if(err){
			res.send("Friend req sent or already added");
			throw err;
		}
		else 
		{}
	},getUser2);
	mysql.fetchData(function(err,results){
		if(err){
			res.send("Friend req sent or already added");
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log(results);
				ejs.renderFile('./views/add_friend.ejs', { data: results } , function(err, result) {
			        // render on success
			        if (!err) {
			        	console.log("sefew");
			            res.end(result);
			        }
			        // render or error
			        else {
			        	console.log("bfthyth");
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
		}
	},getUser);
};

exports.cn_group = function(req,res)
{
	console.log(req.body.gname);
	//res.redirect("/afterSignIn");
	var getRes="INSERT into fb.group (group.g_name, group.member, group.flag) VALUES ('"+req.session.username+"', '"+req.body.gname+"', 1)";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			res.redirect("/afterSignIn");
		}
	},getRes);
};

exports.d_group = function(req,res)
{
	console.log(req.body.idp);
	//res.redirect("/afterSignIn");
	var getRes="DELETE FROM fb.group WHERE member = '"+req.body.idp+"' and g_name = '"+req.session.username+"'";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			res.redirect("/afterSignIn");
		}
	},getRes);
};

exports.je_group = function(req,res)
{
	var getRes="INSERT into fb.group (g_name, member, flag) VALUES ('"+req.session.username+"', '"+req.body.idp2+"', 0)";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{

			res.redirect("/afterSignIn");
		}
	},getRes);
};

exports.d_list_group = function(req,res)
{
	var getRes="SELECT * from fb.group where g_name = '"+req.session.username+"' and flag = 1";
	mysql.fetchData(function(err,results){
		if(err){
			res.send("You do not own any group");
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log(results);
				ejs.renderFile('./views/del_group.ejs', { data: results } , function(err, result) {
			        // render on success
			        if (!err) {
			        	console.log("sefew");
			            res.end(result);
			        }
			        
				});
			}else{
				res.send("You do not own any group");
			}
		}
	}, getRes);
};

exports.del_group = function(req,res)
{
	var getRes="DELETE from fb.group where member = '"+req.body.gp_name+"'";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.redirect("/afterSignIn");
		}
	},getRes);
};

exports.group_view = function(req, res){
	//console.log(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
	var getRes="select DISTINCT * from fb.users where users.emailid in (select g_name from fb.group where group.member='"+req.body.grp_n+"')";
	var getRes2="select * from fb.users where users.emailid in (Select g_name from fb.group where group.member = '"+req.body.grp_n+"' and flag=1)";
	var getRes3="select * from fb.group_cmnt where member = '"+req.body.grp_n+"' ORDER BY g_name DESC limit 5";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			mysql.fetchData(function(err,results2){
				if(err){
					throw err;
				}
				else{
					mysql.fetchData(function(err,results3){
						if(err){
							throw err;
						}
						else{
						ejs.renderFile('./views/group_view.ejs', { data: results, data2:results2, data3:results3 } , function(err, result) {
					        // render on success
					        if (!err) {
					        	console.log("sefew");
					            res.end(result);
					        }
					        
						});
						}
					},getRes3);
					}
			},getRes2);
				}
		},getRes);
}; 

exports.group_comment = function(req, res){
	console.log(req.body.userComment);
	console.log(req.body.nm);
	console.log(Date.now());
	//res.redirect("/");
	var getRes="insert into fb.group_cmnt (g_name, member, comment) values ('"+req.session.username+"', '"+req.body.nm+"', '"+req.body.userComment+"' )";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.redirect("/afterSignIn");
		}
	},getRes);
};

exports.status = function(req, res){
	console.log("-----------------Reached----------------@@@@");
	var getRes="insert into fb.timeline (emailid, u_comment) values ('"+req.session.username+"', '"+req.body.status+"' )";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.redirect("/afterSignIn");
		}
	},getRes);
};


exports.signin=signin;
exports.afterSignIn=afterSignIn;
exports.getAllUsers=getAllUsers;