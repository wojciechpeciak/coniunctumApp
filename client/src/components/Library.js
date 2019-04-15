import React, {Component} from 'react';
import {getLibrary} from './UserFunctions'
import ImgContainer from './ImgContainer';
import { HEADERBAR } from '../TextContent';

class Library extends Component {
    constructor(props){
        super(props)

        this.state={
            items: []
        };
    }

    componentWillMount(){
        getLibrary(this.props.relationshipId)
        .then(res => {
            this.setState({items: res.list});

        });
    }

    render(){
        const list = this.state.items.map((item, key) => {
            return <ImgContainer key={key} message={item}/>
        }, this);

        return (
            <div className="conversationLibrary">
                <div className="libraryBar">
                    <p className="libraryTitle">{HEADERBAR.P2_library[this.props.lang]}</p>
                    <input type="image" src="https://image.flaticon.com/icons/svg/271/271218.svg" alt="Back" onClick={this.props.toggle}/>
                </div>
                <div className="libraryContent">
                    {list.length === 0 ? (<h1>{HEADERBAR.H1_library[this.props.lang]}</h1>) : list}
                </div>
            </div>
        );
    }
}

export default Library;