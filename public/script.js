const socket = io('http://localhost:9000',{
    query:{
        token:'token'
    }
});

const socket1 = io('http://localhost:9000/admin')
//step1
socket.on('connect',()=>{
    console.log('connected',socket.id)
});

//step2
socket.emit('join',{room:'testroom'},function(data){
  console.log('Joined',data);
});

//step 4
document.querySelector('#message-form').addEventListener('submit',(event)=>{
    event.preventDefault();
    const newMessage = document.querySelector('#user-message').value;
    socket.emit('messageToServer',{text: newMessage,id:socket.id});
});

//step 5
socket.on('serverToClients',(msg)=>{
    console.log(msg)
    document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`
});

socket.on('privateMessage',(data)=>{
    console.log(data);
})

//send by server to entire namespace 
socket.on('serverToEntireNameSpace',(data)=>{
    console.log(data);
});

//emit by admin namespace
socket1.on('welcome',data=>{
  console.log(data);
});

//send by admin namespace through global namespace
socket1.on('communicate',data=>{
    console.log(data);
});


//check connectivity
//ping send by server to client
// socket.on('ping',()=>{
//     console.log('Ping was recieved from the server.');
//     console.log(io.protocol)
// })

//pong send by client to server
// socket.on('pong',(latency)=>{
//     console.log(latency);
//     console.log("Pong was sent to the server.")
// })