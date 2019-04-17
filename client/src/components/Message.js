import React, {Component} from 'react';
import MessageOptions from './MessageOptions';

class Message extends Component{

    render() {
        const optionsProps = { socket: this.props.socket, message: this.props.message, relationshipId: this.props.user.relationshipId };
        // quickfix, because of realtive paths
        const imgUrl = this.props.message.content.replace('upload', 'upload/if_w_gt_200_and_h_lt_160,w_200/if_h_gt_160,h_160');
        /*key={this.props.key} */
        return (
            <div
                className={this.props.user.nickname === this.props.message.author ? 'message' : 'message partner'}
                >

                <MessageOptions { ...optionsProps } lang={this.props.user.lang}/>

                {this.props.message.type === 'img'? 
                    (<p className="content"><img src={imgUrl} alt="userPhoto"/></p>) :
                    (<p className="content" ref>{this.props.message.content}</p>)
                }
                <img src={this.props.authorImg} alt='author img' className="avatar"/>

            </div>
        );
    }
}

export default Message;