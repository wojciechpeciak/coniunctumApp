import React, {Component} from 'react';
import closeView from '../assets/error.png';
const preURL = './userImages';

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
        const imgUrl = preURL + (this.props.message.conversation.content.replace('..\\client\\public\\userImages\\', '/'));

        const fullScreen = 
            <div className="fullScreen">
                <input type="image" src={closeView} alt="close view" onClick={this.toggleFullScreen}/>
                <img src={imgUrl} alt="userPhoto"/>
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