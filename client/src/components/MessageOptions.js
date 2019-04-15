import React, {Component} from 'react';
import {MESSAGE_DELETE} from '../Events'
import moment from 'moment';
import { CHATSECTION } from '../TextContent';

// props = { socket, message }
class MessageOptions extends Component{
    constructor(props){
        super(props)

        this.state = {
            open: false,
            statusVisible: false
        };

        this.onClick = this.onClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);
        this.messageStatusRender = this.messageStatusRender.bind(this);
        this.onClickStatus = this.onClickStatus.bind(this);
    }
    //To open and close options
    onClick(e){
        this.setState(prevState => (
            { open: !prevState.open }
        ));
    }
    //To open and close options
    onBlur(e){
        console.log(e);
        this.setState({open: false});
    }
    //Copy option
    copyToClipboard(){
        // Create new element
        var el = document.createElement('textarea');
        // Set value (string to be copied)
        el.value = this.props.message.content;
        // Set non-editable to avoid focus and move outside of view
        el.setAttribute('readonly', '');
        el.style = {position: 'absolute', left: '-9999px'};
        document.body.appendChild(el);
        // Select text inside element
        el.select();
        // Copy text to clipboard
        document.execCommand('copy');
        // Remove temporary element
        document.body.removeChild(el);
    }
    //Delete option
   //emits action to delete message from db and server emits back conversation to rerender view
    deleteMessage(){
        const { socket } = this.props;

        socket.emit(MESSAGE_DELETE, this.props.message._id, this.props.relationshipId);
    }
    //Status option
    // onClick status button make status component visible
    onClickStatus(e){
        this.setState(prevState => ({
            statusVisible: !prevState.statusVisible
        }))
    }

    // Crates message status component
    messageStatusRender(){
        return  (
            <div className="statusContainer">
                <div className="messageStatus">
                <div className="info">
                    <p>{CHATSECTION.P1_messageStatus[this.props.lang] +  this.props.message.author}</p>
                </div>
                <div className="info">
                    <p>{CHATSECTION.P2_messageStatus[this.props.lang] + moment(this.props.message.date).format('ddd, DD.MM.YYYY, HH:mm') }</p>
                </div>
                <button type="button" onClick={ () => {this.onClickStatus(); this.onClick()} }>OK</button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="options">
                <input 
                type="image" 
                src="https://image.flaticon.com/icons/svg/149/149947.svg" 
                alt="Options" 
                onClick={this.onClick}
                className={this.state.open? 'actionsOpen': ''}
                />
                { this.state.open ? 
                    (
                        <div className="actions">
                        <button type="button" onClick={ () => {this.copyToClipboard(); this.onClick()} }>{CHATSECTION.BUTTON1_messageOption[this.props.lang]}</button>
                        <button type="button" onClick={ this.onClickStatus}>{CHATSECTION.BUTTON2_messageOption[this.props.lang]}</button>
                        {this.state.statusVisible && <this.messageStatusRender />}
                        <button type="button" onClick={ () => {this.deleteMessage(); this.onClick()} }>{CHATSECTION.BUTTON3_messageOption[this.props.lang]}</button>
                        </div>
                    ): null
                }
            </div>
        );
    }
}

export default MessageOptions;