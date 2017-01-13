var express	=	require('express');
var session	=	require('express-session');
var bodyParser  = 	require('body-parser');
var passport = require('passport');
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

var connection = require('./app/config');  // added connection file
var routes = require('./app/routes')(app);  // added router file
var post = require('./app/users')(app);    // added post method file
var usernames = {};
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
var port = process.env.PORT || 1337;
http.listen(port);
