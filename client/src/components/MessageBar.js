import React, {Component} from 'react';
import {MESSAGE_SENT} from '../Events';
import sendIcon from '../assets/sent-mail.png';
import imageIcon from '../assets/image.png';
import { upload } from './UserFunctions';
const SocketIOFileUpload = require('socketio-file-upload/client');

class MessageBar extends Component{

    constructor(props){
        super(props);

        this.state={
            author: this.props.user.nickname,
            messageContent:'',
            errors: {}
        }

        this.onchange = this.onchange.bind(this);
        this.onsubmit = this.onsubmit.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    /*componentWillMount(){
        if(localStorage.usertoken === undefined) {
        } else {
            const token = localStorage.usertoken;
            const decoded = jwt_decode(token);
            this.setState({
                author: decoded.nickname
            });
        }
    }*/

    componentDidMount(){
       /* // file uploader part
        const uploader = new SocketIOFileUpload(this.props.socket)

        uploader.listenOnInput(
            document.getElementById("img")
            );
        // On upload start add author and send message
        uploader.addEventListener("start", (event) => {
            event.file.meta.author = this.state.author;
            event.file.meta.relationshipId = this.props.user.relationshipId;
        });*/
    }

    onchange(e){
        this.setState({[e.target.name]: e.target.value});
    }
    
    onsubmit(e){
        e.preventDefault();

        const message = {
            content: this.state.messageContent,
            author: this.state.author,
            date: (new Date())
        }
        // don't send empty message
        if(message.content.length !== 0){
            this.props.socket.emit(MESSAGE_SENT, message, this.props.user);
            this.setState({messageContent: ''});
        }
    }

    uploadImage(e){
        e.preventDefault();
        const inputNode = this.uploadInput;
        if(inputNode.files[0] && this.validFileType(inputNode.files[0])){
            const data = new FormData();
            data.append('file', inputNode.files[0]);

            upload(data)
            .then(res => {
                if(res.uploaded !== undefined){
                    inputNode.value = '';

                    console.log('image upload done');
                }
            })
        }
    }

    validFileType(file){
        const fileTypes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png'
        ];

        for (let index = 0; index < fileTypes.length; index++) {
            if (fileTypes[index] === file.type)
                return true;            
        }
        return false;
    }

    render () {
        return (
            <div className='messageBar'>
                <div className="fileUpload">
                    <label htmlFor="img"><img src={imageIcon} alt="send img"/></label>
                    <input type="file" name="messageImg" id="img"
                    accept="image/*"
                    ref={(ref) => (this.uploadInput = ref)}
                    onChange={this.uploadImage}/>
                </div>

                <form className="messageForm" onSubmit={this.onsubmit}>
                    <textarea 
                    name="messageContent" 
                    id="sender" 
                    value={this.state.messageContent}
                    onChange={this.onchange}
                    ></textarea>
                    <input type="image" src={sendIcon} alt="send icon"/>
                </form>
            </div>
        );
    }
}

export default MessageBar;