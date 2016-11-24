var express	=	require('express');
var session	=	require('express-session');
var bodyParser  = 	require('body-parser');
var passport = require('passport');
var crypto = require('crypto');
var async = require('async');
var app	= express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
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
var path = __dirname + '/views/';
// usernames which are currently connected to the chat
var connection = require('./app/config');
var routes = require('./app/routes')(app);
var usernames = {};

// rooms which are currently available in chat
var rooms = ['Room'];

io.sockets.on('connection', function (socket) {

    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function(username){
        // store the username in the socket session for this client
        socket.username = username;
        // store the room name in the socket session for this client
        socket.room = 'Room';
        // add the client's username to the global list
        usernames[username] = username;
        // send client to room 1
        socket.join('Room');
        // echo to client they've connected
        socket.emit('updatechat', username , 'you have connected Now..!!!');
        // echo to room 1 that a person has connected to their room
        socket.broadcast.to('Admin').emit('updatechat', username, ' has connected to this room');
        socket.emit('updaterooms', rooms, 'Room');
    });

    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data) {
        // we tell the client to execute 'updatechat' with 2 parameters
        io.sockets.in(socket.room).emit('updatechat', socket.username, data);
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function(){
        // remove the username from global usernames list
        delete usernames[socket.username];
        // update list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
        // echo globally that this client has left
        socket.broadcast.emit('updatechat',  socket.username ,' has disconnected');
        socket.leave(socket.room);
    });
});


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

// login page
/*app.get('/login', function(req, res) {
    sess=req.session;
    if(sess.email)
    {
        res.redirect('/dashboard');
    }
    else{
        res.render('login');
    }
});*/

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
        connection.query("select * from users where email = '" + req.body.email + "' and password = '" + hashnew + "'", function (err, rows) {
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
                sess = req.session;
                sess.email = req.body.email;
                res.end('done');
            }
        });
});

app.post('/addCategory',function(req,res){
    var queryString = "insert into category(name,description,website) values('" + req.body.category + "','" + req.body.description + "','" + req.body.website + "')";
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
    var queryString = "insert into subcategory(category_id,name,description,website) values('" + req.body.categoryid + "','" + req.body.subcategory + "','" + req.body.subdescription + "','" + req.body.subwebsite + "')";
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
app.post('/removeCategory',function(req,res){
   /* var queryString = "DELETE FROM category WHERE id=" +req.body.categoryid;
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
    });*/
    connection.query("DELETE FROM category WHERE id= '" +req.body.categoryid+"'",function(err,result2) {
        connection.query("DELETE FROM subcategory WHERE category_id='" +req.body.categoryid+"'",function(err,result3) {
            console.log(result3);
            res.end('done');
        });
});
});
app.post('/searchResult',function(req,res){
    console.log(req.body.keyword);
    var queryString = "SELECT * FROM category inner JOIN subcategory ON category.id=subcategory.category_id WHERE category.description or subcategory.description Like '%" + req.body.keyword + "%'";
    console.log(queryString);
    connection.query(queryString, function (error, results) {
        if (error) {
            throw error;
        }
        else {
            //res.send('Inserted Successfully!');
            res.type('text/plain');
            res.json(results);
           // res.end('done');

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
app.post('/editinfo',function(req,res){
            var created = new Date();
            var queryString = "UPDATE users SET name='" + req.body.name + "',dob='" + req.body.dob + "',organization='" + req.body.org + "',created='" + created + "' WHERE email='" + req.body.email + "'";
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
    });
app.post('/removeuser',function(req,res){
    var queryString = "DELETE FROM users WHERE id='" + req.body.id + "'";
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
});
app.post('/changePassword',function(req,res){
    var hashnew = crypto.createHash('md5').update(req.body.password).digest("hex");
    var queryString = "UPDATE users SET password='" + hashnew + "' WHERE email='" + sess.email + "'";
    console.log(queryString);
    connection.query(queryString, function (error, results) {
        if (error) {
            throw error;
        }
        else {
            //res.send('Inserted Successfully!');
            res.type('text/plain');
            res.json(results);
            // res.end('done');

            // res.write("Looked everywhere, but couldn't find that page at all!\n");
        }
    });
});
// Register page
/*app.get('/register', function(req, res) {
    sess=req.session;
    if(sess.email)
    {
        res.redirect('/dashboard');
    }
    else{
        res.render('register',{user: "Great User",title:"homepage"});
    }
});*/
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
/*app.get('/logout',function(req,res){

    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }
        else
        {
            res.redirect('/');
        }
    });

});*/



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

http.listen(3000,function(){
  console.log("Live at Port 3000");
});