import React, {Component} from 'react';
import closeView from '../assets/error.png';

class ImgContainer extends Component {

    constructor(props){
        super(props)

        this.state = {
            isFullScreen: false
        }
        this.toggleFullScreen = this.toggleFullScreen.bind(this);
    }

    toggleFullScreen(){
        this.setState(prevState => ({isFullScreen: !prevState.isFullScreen}));
    }

    render(){

        // quickfix, because of realtive paths
        const imgUrl = this.props.message.conversation.content.replace('upload', 'upload/if_w_gt_400_and_h_lt_400,w_400/if_h_gt_400,h_400');

        const fullScreen = 
            <div className="fullScreen">
                <input type="image" src={closeView} alt="close view" onClick={this.toggleFullScreen}/>
                <img src={this.props.message.conversation.content} alt="userPhoto"/>
            </div>
        return (
            <div className="imgContainer">
                <input type="image" src={imgUrl} alt="userPhoto" onClick={this.toggleFullScreen}/>
                {this.state.isFullScreen && fullScreen}
            </div>
        );
    }
}

export default ImgContainer;