const express = require('express');
const path = require('path');
const app = express();
const socketio = require('socket.io');

app.use(express.static(path.join(__dirname,'public')));

const expressServer = app.listen(9000);
const io = socketio(expressServer);
//io === server in socket.io server doc;

//allow origins cors
io.origins((origin, callback) => {
    console.log(origin);
    if (origin !== 'http://127.0.0.1:8080') {
      return callback('origin not allowed', false);
    }
    callback(null, true);
});

//middleware
io.use((socket, next) => { 
    console.log(socket.handshake.query.token);
    next();
});

io.on('connection',(socket)=>{
    socket.emit('serverToEntireNameSpace','Welcome to global namespace /');
    socket.on('messageToServer',(msg)=>{
        console.log(msg);
        
        //it send data exclude sender ----
          //socket.to('testroom').emit('serverToClients',{text:msg.text})
          // socket.broadcast.to('testroom').emit('serverToClients',{text:msg.text});
        //it send data to all clients include sender ----
          io.to('testroom').emit('serverToClients',{text:msg.text});
          //io.in('testroom').emit('serverToClients',{text:msg.text});
         
        
        //private message ----
          //io.to(msg.id).emit('privateMessage', "Test Private Message");

        //send message to client from other namespace
        io.of('/admin').emit('communicate','From global namespace');  
    })


    //step 3
    //join room
   socket.on('join',(data,cb)=>{
       socket.join('testroom');
       cb(data.room);
   });

});


//other namespace or channel
io.of('/admin').on('connection',(socket)=>{
  socket.emit('welcome','Welcome from admin namespace');
 
});