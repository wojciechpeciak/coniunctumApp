import React, {Component} from 'react';
import Library from './Library';
import galleryIcon from '../assets/gallery.png';
import './HeaderBar.css';
import { HEADERBAR } from '../TextContent';

class HeaderBar extends Component{
    constructor(props){
        super(props);

        this.state = {
            libraryVisible: false
        };

        this.toggleLibraryVisible = this.toggleLibraryVisible.bind(this);
    }

    toggleLibraryVisible(){
        this.setState(prevState => ({ libraryVisible: !prevState.libraryVisible}));
    }

    render () {

        const bigDate = this.props.bigDate === null? 
            (HEADERBAR.P1_noBigDate[this.props.user.lang]) : 
            (HEADERBAR.P1_BigDate_1[this.props.user.lang]+this.props.bigDate.title+HEADERBAR.P1_BigDate_2[this.props.user.lang]+this.props.bigDate.date+HEADERBAR.P1_BigDate_3[this.props.user.lang])

        return (
            <header className="headerBar"> 
                <div className="openTab">
                    <img src="https://image.flaticon.com/icons/svg/766/766583.svg" alt="Brand logo"/>
                    <p className="tabTitle">{this.props.currentComponent}</p>
                </div>
                <p className="counter">
                    {bigDate}
                </p>
                <div className="extraTools">
                    <label htmlFor="gallery" className="galleryInfo">{HEADERBAR.P2_library[this.props.user.lang]}</label>
                    <input id='gallery' type="image" src={galleryIcon} alt="gallery" onClick={this.toggleLibraryVisible}/>
                    {this.state.libraryVisible && <Library toggle={this.toggleLibraryVisible} relationshipId={this.props.user.relationshipId} lang={this.props.user.lang}/>}
                </div>
            </header>
        );
    }
}

export default HeaderBar;