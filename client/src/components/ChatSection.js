import React, {Component, Fragment} from 'react';
import io from 'socket.io-client';
import './ChatSection.css';
import MessageBar from './MessageBar';
import {MESSAGE_RECIEVED, USER_CONNECTED} from '../Events'
import Message from './Message';

const socketUrl = 'https://localhost:'+ process.env.PORT;


class ChatSection extends Component{
    constructor(props){
        super(props);

        this.state = {
            socket: io(socketUrl),
            messages: []
        };

        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    scrollToBottom() {
        this.bottom.scrollIntoView();
    }

    componentWillMount(){
        //const socket = ;
            const componentThis = this;
            //componentThis.setState({socket: socket});

        this.state.socket.on('connect', () => {
            // get chat history
            componentThis.state.socket.on(USER_CONNECTED, (messages, relationshipId) => {
                if(this.props.user.relationshipId === relationshipId && messages){
                    componentThis.setState(prevState => ({
                        messages: [...messages]
                    }));
                    console.log(componentThis.state.messages);
                }
            });
            // update chat with new message
            componentThis.state.socket.on(MESSAGE_RECIEVED, (messages, relationshipId) => {
                if(this.props.user.relationshipId === relationshipId && messages)
                componentThis.setState(prevState => ({
                    messages: [...prevState.messages, ...messages]
                }));
                console.log(componentThis.state.messages);
            });

            componentThis.state.socket.emit(USER_CONNECTED, componentThis.props.user);
            console.log("Connected to socket.io");
        });
        
    }

    componentWillUnmount(){
        this.state.socket.off(USER_CONNECTED);
        this.state.socket.off(MESSAGE_RECIEVED);
        this.state.socket.off('connect');
    }
    
    componentDidUpdate(){
        this.bottom.scrollIntoView();
    }

//
    render () {

        const feed = this.state.messages.map((message, key) => {
            return <Message 
                key={key} 
                message={message} 
                user={this.props.user} 
                socket={this.state.socket}
                authorImg={message.author === this.props.user.nickname? this.props.userImg : this.props.partnerImg}
                />
        }, this);

        return(
            <Fragment>
                <section className="conversation">
                {feed}
                {/* div used to scroll to bottom */}
                <div ref={(bottom) => { this.bottom = bottom; }}></div>
                </section>
                
                <MessageBar socket={this.state.socket} user={this.props.user} />
            </Fragment>
        );
    }
}

export default ChatSection;