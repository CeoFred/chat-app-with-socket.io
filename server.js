var express = require('express');
var app = express();
var server = require('http').createServer(app);

var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);

console.log('Connected listeing on 3000');
app.get('/',function(req,res){
    res.sendFile(__dirname+ '/index.html');
});
app.get('/join',function(req,res){
    res.sendFile(__dirname+ '/join.html');
});


io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log('Connected %s sockets connected',connections.length);

    socket.on('disconnect',function(data){
        // if(!socket.username) return;
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
    connections.splice(connections.indexOf(socket),1);
    console.log('Disconnected %s sockects connected',connections.length);
    });

    socket.on('send message',function(data){
        console.log(data);
        io.sockets.emit('new message',{msg:data,user:socket.username});
    });

    socket.on('user typing',function(data){

        console.log('User typing is ' + data);

        console.log('All users incluude '+ users);

        //filtering list that does not contain user that is
        $userApartFromSender = users.filter(users => users!== data);

        console.log('Users not typing include '+$userApartFromSender+' User that is typing is '+data);

        io.sockets.emit('userTyping',{users:$userApartFromSender,user:data});
    });

    //No typing
    socket.on('noTyping',function(){
        // io.sockets.emit()
    });
    //New User
    socket.on('new user',function(data,callback){
        
        callback(true);
        socket.username = data;
        users.push(socket.username);
        console.log('Array of users '+users);

        updateUsernames();

    });
    function updateUsernames(){
        io.sockets.emit('get users',users);
    }

});