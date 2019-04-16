const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const io = require('socket.io');
const path = require('path');
const fileUpload = require('express-fileupload');
const {MESSAGE_RECIEVED} = require('./client/src/Events');


const port = process.env.PORT || 5000;

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
//user img uploading to cloudinary
app.post('/upload', (req, res) => {

    const {relationshipId, author} = req.body;
    // get file and name
    const imgFile = req.files.file;
    const uniqueFilename = new Date().getTime();
    const base64File = 'data:image/png;base64,'+imgFile.data.toString('base64');
    // set up cloudinary
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
        cloud_name: 'wagon15',
        api_key: '855874492865595',
        api_secret: 'El7L2XtTtAu9eec41JAd8uOS_y0'
    });

    // upload img
    cloudinary.uploader.upload(
        base64File,
        { public_id: `coniunctum/${uniqueFilename}`, tags: `coniunctum` }, // directory and tags are optional
        function(err, image) {
          if (err) return res.send(err)
          
            //create img message
            const message = {
                author: author,
                content: image.secure_url,
                date: image.created_at,
                type: 'img'
            }
            // save url to DB
            Relationship
            .findOneAndUpdate({
                _id: relationshipId}, 
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
                res.json({uploaded: true});
                ioServer.emit(MESSAGE_RECIEVED, [...mess], relationshipId);
                console.log('Message saved in DB and emitted to others', image.url);
            })
            .catch(err => {
                console.log("Err img message creation:" + err);
            });
        });
});
//
// redirection to rest
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

//socket io and expres server listening
var ioServer = io.listen(
        app.listen(port, () => {
            console.log("Server is running on port " + port);
        })
    );
//socket event
const SocketManager = require('./routes/SocketManger')

// inintialize lsteners
ioServer.sockets.on('connection', (socket) => {
   
    // hanndle module
    SocketManager(socket, ioServer);
});


