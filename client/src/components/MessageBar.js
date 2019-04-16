import React, {Component} from 'react';
import {MESSAGE_SENT} from '../Events';
import sendIcon from '../assets/sent-mail.png';
import imageIcon from '../assets/image.png';
import { upload } from './UserFunctions';

class MessageBar extends Component{

    constructor(props){
        super(props);

        this.state={
            author: this.props.user.nickname,
            messageContent:'',
            errors: {},
            isUploading: false
        }

        this.onchange = this.onchange.bind(this);
        this.onsubmit = this.onsubmit.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
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
        const inputNode = this.uploadInput;
        const { relationshipId, nickname} = this.props.user;
        const component = this;
        e.preventDefault();
        
        if(inputNode.files[0] && this.validFileType(inputNode.files[0])){
            this.setState({ isUploading: true}, () => {
            
                let file = inputNode.files[0];
                let reader = new FileReader();
                // resize foto
                let img = document.createElement("img");

                reader.onload = (e) => {img.src = e.target.result};
                // main resize logic
                reader.onloadend = (e) => {
                    let canvas=document.createElement("canvas");
                    let context=canvas.getContext("2d");
                    context.drawImage(img, 0, 0);

                    const MAX_WIDTH = 1024;
                    const MAX_HEIGHT = 1024;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    context = canvas.getContext("2d");
                    context.drawImage(img, 0, 0, width, height);

                    canvas.toBlob( (blob) => {

                        const data = new FormData();
                        data.append('file', blob);
                        data.append('relationshipId', relationshipId);
                        data.append('author', nickname);

                        upload(data)
                        .then(res => {
                            if(res.uploaded !== undefined){
                                inputNode.value = '';
                                component.setState({isUploading: false});
                                console.log('image upload done');
                            }
                        }).catch( err => {
                            if (err) 
                                component.setState({ isUploading: false });
                        })
                    }, 'image/jpeg');
                }
                reader.readAsDataURL(file);
                
            });
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
                    {this.state.isUploading && <div className='loadBackground'><div className="sp sp-circle"></div></div>}
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