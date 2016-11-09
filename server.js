var express		=	require('express');
var session		=	require('express-session');
var bodyParser  	= 	require('body-parser');
var passport = require('passport');
var crypto = require('crypto');
var async = require('async');
var app			=	express();

/*hash = require('./pass').hash;*/
var LocalStrategy   = require('passport-local').Strategy;
app.use(bodyParser.urlencoded({ extended: false }));
var router = express.Router();
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
    app.use("/",router);
    app.use(express.static('views'));
    app.set('view engine', 'ejs');

//app.engine('.html', require('ejs').__express);
var path = __dirname + '/views/';

/*router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.ejs");
});

router.get("/register",function(req,res){
  res.sendFile(path + "register.ejs");
});

router.get("/login",function(req,res){
  res.sendFile(path + "login.ejs");
});*/
//mysql 
var mysql = require('mysql');
var connection = mysql.createConnection({
    connectionLimit : 100, //focus it
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'searchdb'
});
var users = [
    { name: 'tobi', email: 'tobi@learnboost.com' }
];
console.log(users);
/*app.get('/', function(req, res){
    res.render('index',{user: "Great User",title:"homepage"});
})*/
var sess;

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
// login page
app.get('/login', function(req, res) {
    sess=req.session;
    if(sess.email)
    {
        res.redirect('/dashboard');
    }
    else{
        res.render('login');
    }
});
app.get('/admin',function(req,res){
    sess=req.session;
    if(sess.email)
    {
        res.render('admin-dashboard');
    }
    else{
        res.render('admin');
    }
});
app.get('/admin-dashboard', function(req, res) {
    sess=req.session;
    if(sess.email)
    {
        /*connection.query("select * from  users where email = '"+sess.email+"'",function(err,rows) {
            res.render('admin-dashboard', {user: "Great User", session: req.session, usersinfo: rows});
        });*/
        connection.query("select * from  users where email = '"+sess.email+"'", function(err, result1) {
            connection.query("select * from  category", function(err, result2) {
                console.log(result1);
                console.log(result2);
                res.render('admin-dashboard', { usersinfo : result1, category: result2 });
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
    else{
        res.redirect('/admin');
    }
});
app.post('/adminlogin',function(req,res){

    var hashnew = crypto.createHash('md5').update(req.body.pass).digest("hex");
    connection.query("select * from users where email = '"+req.body.email+"' and password = '"+hashnew+"'",function(err,rows){
        console.log(rows);
        console.log("above row object");
        numRows = rows.length;
        console.log(numRows);
        if (err)
            return done(err);
        if (numRows == 0) {
            // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            res.end('Please enter correct credentials.');
        }
        else {
            sess=req.session;
            sess.email=req.body.email;
            res.end('done');
        }
    });

});
app.post('/login',function(req,res){

    var hashnew = crypto.createHash('md5').update(req.body.pass).digest("hex");
    connection.query("select * from users where email = '"+req.body.email+"' and password = '"+hashnew+"'",function(err,rows){
        console.log(rows);
        console.log("above row object");
        numRows = rows.length;
        console.log(numRows);
        if (err)
            return done(err);
        if (numRows == 0) {
           // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            res.end('Please enter correct credentials.');
        }
        else {
            sess=req.session;
            sess.email=req.body.email;
            res.end('done');
        }
        });

});

app.post('/addCategory',function(req,res){
    var queryString = "insert into category(name,description) values('" + req.body.category + "','" + req.body.description + "')";
    console.log(queryString);
    connection.query(queryString, function (error, results) {
        if (error) {
            throw error;
        }
        else {
            //res.send('Inserted Successfully!');
            res.end('done');

            // res.write("Looked everywhere, but couldn't find that page at all!\n");
        }
    });
});
app.post('/addSubCategory',function(req,res){
    var queryString = "insert into subcategory(category_id,name,description) values('" + req.body.categoryid + "','" + req.body.subcategory + "','" + req.body.subdescription + "')";
    console.log(queryString);
    connection.query(queryString, function (error, results) {
        if (error) {
            throw error;
        }
        else {
            //res.send('Inserted Successfully!');
            res.end('done');

            // res.write("Looked everywhere, but couldn't find that page at all!\n");
        }
    });
});
app.post('/signup',function(req,res){

    connection.query("select * from  users where email = '"+req.body.email+"'",function(err,rows) {
        console.log(rows);
        // console.log("above row object");
        numRows = rows.length;
        console.log(numRows);
        if (err)
            return done(err);
        if (numRows == '1') {
            // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
             res.end('done');
        }
        else {
            var created = new Date();
            var hash = crypto.createHash('md5').update(req.body.pass).digest("hex");
            var queryString = "insert into users(name,dob,email,password,organization,created) values('" + req.body.name + "','" + req.body.dob + "','" + req.body.email + "','" + hash + "','" + req.body.org + "','" + created + "')";
            console.log(queryString);
            connection.query(queryString, function (error, results) {
                if (error) {
                    throw error;
                }
                else {
                    //res.send('Inserted Successfully!');
                    res.end('success');

                    // res.write("Looked everywhere, but couldn't find that page at all!\n");
                }
            });
        }
    });
});
// Register page
app.get('/register', function(req, res) {
    sess=req.session;
    if(sess.email)
    {
        res.redirect('/dashboard');
    }
    else{
        res.render('register',{user: "Great User",title:"homepage"});
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
app.get('/logout',function(req,res){

    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }
        else
        {
            res.redirect('/');
        }
    });

});
app.get('/profile',function(req,res){
    sess=req.session;
    if(sess.email)
    {
        connection.query("select * from  users where email = '"+sess.email+"'",function(err,rows) {
            //console.log(rows);
           // var usersinfo = JSON.stringify(rows);
           // console.log(usersinfo);
            res.render('profile',{usersinfo:rows,users: users});
        });

        //res.render('index', {data : testimonials});
        //res.redirect('dashboard');
    }
    else
    {
        res.redirect('/login');
    }


});


//opening view

//insert data 
/*app.post('/insert', function(req,res){

  /!* pool.getConnection(function(error,conn){*!/

       var queryString = "insert into customers(name,address,phone,email,status) values('"+req.body.fname+"','"+req.body.address+"','"+req.body.email+"','"+req.body.phone+"','"+req.body.status+"')";
       connection.query(queryString,function(error,results){
           if(error)
               {
                   throw error;
               }
           else 
               {
                //res.send('Inserted Successfully!');
                res.redirect('/');
                  
                // res.write("Looked everywhere, but couldn't find that page at all!\n");
               }
       });
     /!*  conn.release();
   });*!/
});*/



/*app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/login', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        connection.query("select * from  tblusers where username = '"+email+"'",function(err,rows){
            console.log(rows);
            console.log("above row object");
            if (err)
                return done(err);
            if (rows.length) {
               // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                return done('done');
            } else {

                // if there is no user with that email
                // create the user
                var newUserMysql = new Object();

                newUserMysql.email    = email;
                newUserMysql.password = password; // use the generateHash function in our user model

                var insertQuery = "INSERT INTO  tblusers ( username, password ) values ('" + email +"','"+ password +"')";
                console.log(insertQuery);
                connection.query(insertQuery,function(err,rows){
                    newUserMysql.id = rows.userId;

                    return done(null, newUserMysql);
                });
            }
            });
        }));*/





app.listen(3000,function(){
  console.log("Live at Port 3000");
});