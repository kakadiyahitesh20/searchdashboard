

var connection = require('./config');
module.exports = function(app) {
    var sess;
    // load login page
    app.get('/login', function (req, res) {
        sess = req.session;
        if (sess.email) {
            res.redirect('/dashboard');
        }
        else {
            res.render('login');
        }
    });
    // load dashboard page
    app.get('/dashboard',function(req,res){
        sess=req.session;
        if(sess.email)
        {
            connection.query("select * from  users where email = '"+sess.email+"'",function(err,rows) {
                connection.query("select * from  category",function(err,result2) {
                    connection.query("select * from  subcategory",function(err,result3) {

                        res.render('dashboard', {session: req.session, usersinfo: rows,categorylist:result2,subcategorylist:result3});
                    });
                });
            });
        }
        else
        {
            res.redirect('/');
        }

    });

    // Load Register page
    app.get('/register', function (req, res) {
        sess = req.session;
        if (sess.email) {
            res.redirect('/dashboard');
        }
        else {
            res.render('register', {title: "Register"});
        }
    });
    // Load Forogt password page
    app.get('/forgot_password', function (req, res) {
        sess = req.session;
        if (sess.email) {
            res.redirect('/dashboard');
        }
        else {
            res.render('forgot_password', {title: "forgot password"});
        }
    });
    // Load contact page
    app.get('/contact', function (req, res) {
        sess = req.session;
        if (sess.email) {
            res.redirect('/dashboard');
        }
        else {
            res.render('contact', {title: "Contact"});
        }
    });

    // Redirect homaepage after logout
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

    // Load about us page
    app.get('/aboutus', function (req, res) {
        sess = req.session;
        if (sess.email) {
            res.redirect('/dashboard');
        }
        else {
            res.render('aboutus', {title: "homepage"});
        }
    });

    // Load Home page
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

    // Load Dashboard
    app.get('/dashboard', function (req, res) {
        sess = req.session;
        if (sess.email) {
            connection.query("select * from  users where email = '" + sess.email + "'", function (err, rows) {
                //connection.query("SELECT category.id,category.name as categoryname,subcategory.id as subcategoryid,subcategory.name as subcategoryname,category.description as categorydescription,subcategory.description as subcategorydescription FROM category INNER JOIN subcategory ON category.id=subcategory.category_id", function (err, result2) {
                connection.query("select * from  category", function (err, result2) {
                    connection.query("select * from  subcategory", function (err, result3) {
                        console.log(result3);
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
        }
        else {
            res.redirect('/');
        }

    });
    app.get('/live-chat', function (req, res) {
        sess = req.session;
        if (sess.email) {
            connection.query("select * from  users where email = '" + sess.email + "'", function (err, rows) {
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
                res.render('admin-live-chat', {usersinfo: rows});
            });
        }
        else {
            res.redirect('admin');
        }
    });

    // Load admin page
    app.get('/admin', function (req, res) {
        sess = req.session;
        if (sess.email) {
            res.render('admin-dashboard');
        }
        else {
            res.render('admin');
        }
    });

    // Load admin Dahsboard
    app.get('/admin-dashboard', function (req, res) {
        sess = req.session;
        if (sess.email) {
            connection.query("select * from  users where email = '" + sess.email + "'", function (err, result1) {
                connection.query("select * from  category", function (err, result2) {
                    res.render('admin-dashboard', {usersinfo: result1, category: result2});
                });
            });
        }
        else {
            res.redirect('/admin');
        }
    });
    // load profile page
    app.get('/profile', function (req, res) {
        sess = req.session;
        if (sess.email) {
            connection.query("select * from  users where email = '" + sess.email + "'", function (err, rows) {
                res.render('profile', {usersinfo: rows});
            });
        }
        else {
            res.redirect('/login');
        }
    });
    // load edit profile page
    app.get('/editprofile', function (req, res) {
        sess = req.session;
        if (sess.email) {
            connection.query("select * from  users where email = '" + sess.email + "'", function (err, rows) {
                res.render('editprofile', {usersinfo: rows});
            });
        }
        else {
            res.redirect('/login');
        }
    });
    // load User list page
    app.get('/UserList', function (req, res) {
        sess = req.session;
        if (sess.email) {
            connection.query("select * from  users", function (err, rows) {
                connection.query("select * from  users where email = '" + sess.email + "'", function (err, rows1) {
                    res.render('UserList', {userlist: rows,usersinfo : rows1});
                });

            });
        }
        else {
            res.redirect('/login');
        }
    });
    // load customer query page
    app.get('/Customer_Query', function (req, res) {
        sess = req.session;
        if (sess.email) {
            connection.query("select * from  contactus", function (err, rows) {
                connection.query("select * from  users where email = '" + sess.email + "'", function (err, rows1) {
                    res.render('Customer_Query', {querylist: rows,usersinfo : rows1});
                });

            });
        }
        else {
            res.redirect('/login');
        }
    });

    // Load change passoword page
    app.get('/ChangePassword', function (req, res) {
        sess = req.session;
        if (sess.email) {
            connection.query("select * from  users where email = '" + sess.email + "'", function (err, rows) {
                res.render('ChangePassword', {usersinfo: rows});
            });
        }
        else {
            res.redirect('/login');
        }


    });

}