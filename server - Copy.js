var express = require("express");
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var app = express();
/*hash = require('./pass').hash;*/
var LocalStrategy   = require('passport-local').Strategy;
app.use(bodyParser.urlencoded({ extended: false }));
var router = express.Router();
app.use(passport.initialize());
app.use(passport.session());
//app.engine('.html', require('ejs').__express);
var path = __dirname + '/views/';
 app.use("/",router);
app.use(express.static('views'));
app.set('view engine', 'ejs');
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
var users = [
    { name: 'tobi', email: 'tobi@learnboost.com' },
    { name: 'loki', email: 'loki@learnboost.com' },
    { name: 'jane', email: 'jane@learnboost.com' }
];
passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        connection.query("select * from tblusers where username = '"+email+"'",function(err,rows){
            console.log(rows);
            console.log("above row object");
            if (err)
                return done(err);
            if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUserMysql = new Object();

                newUserMysql.email    = email;
                newUserMysql.password = password; // use the generateHash function in our user model

                var insertQuery = "INSERT INTO tblusers ( username, password ) values ('" + email +"','"+ password +"')";
                console.log(insertQuery);
                connection.query(insertQuery,function(err,rows){
                    newUserMysql.id = rows.userId;

                    return done(null, newUserMysql);
                });
            }
        });
    }));
app.post('/insert',
    passport.authenticate('local-signup', { failureRedirect: '/register' }),
    function(req, res) {
        res.redirect('/');
    });
/*app.get('/', function(req, res){
   console.log("home");
    /!*res.render('home', {
        users: users,
        title: "EJS example",
        header: "Some users"
    });*!/
    res.render('Home', { title: 'The index page!' })
});*/

app.get('/', function(req, res){
    res.render('index',{user: "Great User",title:"homepage"});
})
// login page
app.get('/login', function(req, res) {
    res.render('login', {
        users: users,
        title: "EJS example",
        header: "Some users"
    });
});
// Register page
app.get('/register', function(req, res) {
    res.render('register',{user: "Great User",title:"homepage"});
});
//var insert = {
//	getSaveData : function(req, res) {
//		 pool.getConnection(function(error,conn){
//       
//       var queryString = "insert into customers(name,address,phone,email,status) values('"+req.body.fname+"','"+req.body.address+"','"+req.body.email+"','"+req.body.phone+"','"+req.body.status+"')";
//       
//       conn.query(queryString,function(error,results){
//           if(error)
//               {
//                   throw error;
//               }
//           else 
//               {
//                //res.send('Inserted Successfully!');
//                res.redirect('/');
//                  
//                // res.write("Looked everywhere, but couldn't find that page at all!\n");
//               }
//       });
//       conn.release();
//   });
//	},
//        }


//app.use("*",function(req,res){
//  res.sendFile(path + "404.html");
//});
app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
});

// process the signup form
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));
app.listen(3000,function(){
  console.log("Live at Port 3000");
});