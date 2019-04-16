const {MESSAGE_RECIEVED, USER_CONNECTED, MESSAGE_SENT, MESSAGE_DELETE} = require('../client/src/Events');  //require('../../client/src/Events');
const Relationship = require("../models/Relationship");



module.exports = function(clientSocket, ioServer) {
    console.log('Socket Id: '+ clientSocket.id);
    
    // recived on component mounting
    clientSocket.on(USER_CONNECTED, (user) => {
        //connectedUsers = addUser(connectedUsers, user);
        clientSocket.user = user;

        // get chat history form db
        Relationship.findById(user.relationshipId, { conversation:1 }).sort({date: 1}).then( list => {
            ioServer.emit(USER_CONNECTED, list.conversation, user.relationshipId);
        })

        //console.log("Connected users ", connectedUsers);
    });

    // message recieved - recieved on client message sending
    clientSocket.on(MESSAGE_SENT, (message, user) => {
        //Check for empty
        if (message.author === '' || message.content === '') {
            console.log('message empty');
        } else {
            
            Relationship
            .findByIdAndUpdate(
                user.relationshipId, 
                { $push: { conversation:  message } }, 
                { new: true
                })
            .then(relationship => {
                const mess = relationship.conversation.filter((element) => 
                {
                    const date = (new Date(message.date)).getTime();
                    const date2 = element.date.getTime();
                    return (date === date2 && message.content === element.content && message.author === element.author);
                });
                ioServer.emit(MESSAGE_RECIEVED, [...mess], user.relationshipId)
                console.log('Message saved in DB and emitted to others');
            })
            .catch(err => {
                console.log("Err on mesafe save:" + err);
            });
        }
    });
    // Delete message form DB - triggered by user click on delete button
    clientSocket.on(MESSAGE_DELETE, (messageId, relationshipId) => {
        //check for empty
        if(!messageId){
            console.log('delete message id empty');
        } else {
            Relationship
            .findByIdAndUpdate(
                relationshipId, 
                { $pull: { conversation:  { _id: messageId } } }, 
                { new: true})
            .then(relationship => {
                ioServer.emit(USER_CONNECTED, relationship.conversation, relationshipId);
            })
            .catch(err => {
                console.log("Err during message removal:" + err);
            });
        }
    });
}
