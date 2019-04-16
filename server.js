const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const io = require('socket.io');
const siofu = require('socketio-file-upload/server');
const path = require('path');
const fileUpload = require('express-fileupload');


const port = process.env.PORT || 5000;
const pathToStoreImages = '/client/public/userImages';

/* ****************** */
app.use(bodyParser.json( { limit: '50mb', extended: true } ));
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(fileUpload({
    createParentPath: true
}));
app.use(express.static(path.join(__dirname, '/client/build')));

// middelware for socket.io file upload
app.use(siofu.router);

// connect to db
const  mongoURI = 'mongodb://wagon:wagon15@ds119996.mlab.com:19996/coniunctum';
mongoose.connect(mongoURI, {useNewUrlParser: true})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// user routes
const Users = require('./routes/Users');
app.use('/users', Users);
// test method
app.get('/test', (req, res) => {
    res.json({ test: true});
});
/*
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
*/
//socket io and expres server listening
var ioServer = io.listen(
        app.listen(port, () => {
            console.log("Server is running on port " + port);
        })
    );
//socket event
const SocketManager = require('./routes/SocketManger')

ioServer.sockets.on('connection', (socket) => {
    // file uploading
    const uploader = new siofu();
    uploader.dir = pathToStoreImages;
    uploader.listen(socket);
    // file error evetn
    uploader.on('error', (e) => console.log('Error form file uploader', e) );

    // hanndle module
    SocketManager(socket, ioServer, uploader);
});


