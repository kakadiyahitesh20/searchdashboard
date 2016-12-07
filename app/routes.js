var connection = require('./config');
module.exports = function(app) {
    var sess;
    app.get('/login', function (req, res) {
        sess = req.session;
        if (sess.email) {
            res.redirect('/dashboard');
        }
        else {
            res.render('login');
        }
    });

    app.get('/dashboard',function(req,res){
        sess=req.session;
        if(sess.email)
        {
            connection.query("select * from  users where email = '"+sess.email+"'",function(err,rows) {
                //connection.query("SELECT category.id,category.name as categoryname,subcategory.id as subcategoryid,subcategory.name as subcategoryname,category.description as categorydescription,subcategory.description as subcategorydescription FROM category INNER JOIN subcategory ON category.id=subcategory.category_id", function (err, result2) {
                connection.query("select * from  category",function(err,result2) {
                    connection.query("select * from  subcategory",function(err,result3) {
                        console.log(result3);
                        // var usersinfo = JSON.stringify(rows);
                        // console.log(usersinfo);
                        //res.render('profile',{usersinfo:rows,users: users});

                        res.render('dashboard', {user: "Great User", session: req.session, usersinfo: rows,categorylist:result2,subcategorylist:result3});
                    });
                });
            });
            //res.redirect('dashboard');
        }
        else
        {
            res.redirect('/');
        }

    });
// Register page
    app.get('/register', function (req, res) {
        sess = req.session;
        if (sess.email) {
            res.redirect('/dashboard');
        }
        else {
            res.render('register', {user: "Great User", title: "homepage"});
        }
    });
    app.get('/forgot_password', function (req, res) {
        sess = req.session;
        if (sess.email) {
            res.redirect('/dashboard');
        }
        else {
            res.render('forgot_password', {user: "Great User", title: "forgot password"});
        }
    });
    app.get('/contact', function (req, res) {
        sess = req.session;
        if (sess.email) {
            res.redirect('/dashboard');
        }
        else {
            res.render('contact', {title: "Contact"});
        }
    });
    app.get('/logout', function (req, res) {

        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect('/');
            }
        });

    });
    app.get('/aboutus', function (req, res) {
        sess = req.session;
        if (sess.email) {
            res.redirect('/dashboard');
        }
        else {
            res.render('aboutus', {title: "homepage"});
        }
    });

    app.get('/',function(req,res){
        sess=req.session;
        if(sess.email)
        {
            res.redirect('/register');
        }
        else{
            res.render('index');
        }
    });
    app.get('/dashboard', function (req, res) {
        sess = req.session;
        if (sess.email) {
            connection.query("select * from  users where email = '" + sess.email + "'", function (err, rows) {
                //connection.query("SELECT category.id,category.name as categoryname,subcategory.id as subcategoryid,subcategory.name as subcategoryname,category.description as categorydescription,subcategory.description as subcategorydescription FROM category INNER JOIN subcategory ON category.id=subcategory.category_id", function (err, result2) {
                connection.query("select * from  category", function (err, result2) {
                    connection.query("select * from  subcategory", function (err, result3) {
                        console.log(result3);
                        // var usersinfo = JSON.stringify(rows);
                        // console.log(usersinfo);
                        //res.render('profile',{usersinfo:rows,users: users});

                        res.render('dashboard', {
                            user: "Great User",
                            session: req.session,
                            usersinfo: rows,
                            categorylist: result2,
                            subcategorylist: result3
                        });
                    });
                });
            });
            //res.redirect('dashboard');
        }
        else {
            res.redirect('/');
        }

    });
    app.get('/live-chat', function (req, res) {
        sess = req.session;
        if (sess.email) {
            connection.query("select * from  users where email = '" + sess.email + "'", function (err, rows) {
                //console.log(rows);
                // var usersinfo = JSON.stringify(rows);
                // console.log(usersinfo);
                res.render('live-chat', {usersinfo: rows});
            });
        }
        else {
            res.redirect('login');
        }
    });
    app.get('/admin-live-chat', function (req, res) {
        sess = req.session;
        if (sess.email) {
            connection.query("select * from  users where email = '" + sess.email + "'", function (err, rows) {
                //console.log(rows);
                // var usersinfo = JSON.stringify(rows);
                // console.log(usersinfo);
                res.render('admin-live-chat', {usersinfo: rows});
            });
        }
        else {
            res.redirect('admin');
        }
    });
    app.get('/admin', function (req, res) {
        sess = req.session;
        if (sess.email) {
            res.render('admin-dashboard');
        }
        else {
            res.render('admin');
        }
    });
    app.get('/admin-dashboard', function (req, res) {
        sess = req.session;
        if (sess.email) {
            /*connection.query("select * from  users where email = '"+sess.email+"'",function(err,rows) {
             res.render('admin-dashboard', {user: "Great User", session: req.session, usersinfo: rows});
             });*/
            connection.query("select * from  users where email = '" + sess.email + "'", function (err, result1) {
                connection.query("select * from  category", function (err, result2) {
                    res.render('admin-dashboard', {usersinfo: result1, category: result2});
                });
            });
            /*async.parallel([
             function(callback) { connection.query("select * from  category",result) }
             /!*function(callback) { db.query(QUERY2, callback) }*!/
             ], function(err, results) {
             console.log(results);
             res.render('admin-dashboard', { usersinfo : results[0] });
             });*/
        }
        else {
            res.redirect('/admin');
        }
    });
    app.get('/profile', function (req, res) {
        sess = req.session;
        if (sess.email) {
            connection.query("select * from  users where email = '" + sess.email + "'", function (err, rows) {
                //console.log(rows);
                // var usersinfo = JSON.stringify(rows);
                // console.log(usersinfo);
                res.render('profile', {usersinfo: rows});
            });

            //res.render('index', {data : testimonials});
            //res.redirect('dashboard');
        }
        else {
            res.redirect('/login');
        }


    });
    app.get('/editprofile', function (req, res) {
        sess = req.session;
        if (sess.email) {
            connection.query("select * from  users where email = '" + sess.email + "'", function (err, rows) {
                //console.log(rows);
                // var usersinfo = JSON.stringify(rows);
                // console.log(usersinfo);
                res.render('editprofile', {usersinfo: rows});
            });

            //res.render('index', {data : testimonials});
            //res.redirect('dashboard');
        }
        else {
            res.redirect('/login');
        }


    });
    app.get('/UserList', function (req, res) {
        sess = req.session;
        if (sess.email) {
            connection.query("select * from  users", function (err, rows) {
                connection.query("select * from  users where email = '" + sess.email + "'", function (err, rows1) {
                    res.render('UserList', {userlist: rows,usersinfo : rows1});
                });

            });

            //res.render('index', {data : testimonials});
            //res.redirect('dashboard');
        }
        else {
            res.redirect('/login');
        }
    });
    app.get('/Customer_Query', function (req, res) {
        sess = req.session;
        if (sess.email) {
            connection.query("select * from  contactus", function (err, rows) {
                connection.query("select * from  users where email = '" + sess.email + "'", function (err, rows1) {
                    res.render('Customer_Query', {querylist: rows,usersinfo : rows1});
                });

            });

            //res.render('index', {data : testimonials});
            //res.redirect('dashboard');
        }
        else {
            res.redirect('/login');
        }
    });
    app.get('/ChangePassword', function (req, res) {
        sess = req.session;
        if (sess.email) {
            connection.query("select * from  users where email = '" + sess.email + "'", function (err, rows) {
                //console.log(rows);
                // var usersinfo = JSON.stringify(rows);
                // console.log(usersinfo);
                res.render('ChangePassword', {usersinfo: rows});
            });

            //res.render('index', {data : testimonials});
            //res.redirect('dashboard');
        }
        else {
            res.redirect('/login');
        }


    });

}