import React, {Component, Fragment} from 'react';
import { withRouter } from 'react-router-dom';
import './NavSection.css';
import { NAVSECTION } from '../TextContent';


class NavSection extends Component{
    constructor(props){
        super(props);

        this.state = {
            navTabActive: null
        }

        this.toggleTab = this.toggleTab.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    toggleTab(tabNr){
        if(this.state.navTabActive === tabNr)
            this.setState({ navTabActive: null });
        else
            this.setState({ navTabActive: tabNr });
    }

    logOut(e) {
        e.preventDefault();
        localStorage.removeItem('usertoken');
        this.props.history.push('/');
    }

    render () {

        const partnerLabel = this.props.partner === undefined?
            <p>{NAVSECTION.P1_partner[this.props.userObj.lang]}</p>:
            (<Fragment>
            <img src={this.props.partner.userImg} alt="Partner avatar"/>
            <p className="partnerNickname">{this.props.partner.nickname}</p>
            </Fragment>)

        return(
            <section className="navBar">
                    <div className="userLabel">
                        <img  src={this.props.user.userImg} alt="user avatar"/>
                        <p className="nickname">{this.props.user.nickname}</p>
                    </div>
                    <nav className="navigation">
                        <section>
                            <div className={ this.state.navTabActive === 1? 'navOpen' : 'navClose' }>
                                <button
                                className={ this.props.currentComponent === 'gift'? 'active' : '' } 
                                onClick={(e) => {this.props.setComponent(e); this.toggleTab(1)}} 
                                name='gift'
                                >{NAVSECTION.BUTTON1[this.props.userObj.lang]}</button>
                                <button
                                className={ this.props.currentComponent === 'lifeInfo'? 'active' : '' } 
                                onClick={(e) => {this.props.setComponent(e); this.toggleTab(1)}} 
                                name='lifeInfo'
                                >{NAVSECTION.BUTTON2[this.props.userObj.lang]}</button>
                                <button
                                className={ this.props.currentComponent === 'wardrobe'? 'active' : '' } 
                                onClick={(e) => {this.props.setComponent(e); this.toggleTab(1)}} 
                                name='wardrobe'
                                >{NAVSECTION.BUTTON3[this.props.userObj.lang]}</button>
                                <button
                                className={ this.props.currentComponent === 'favorites'? 'active' : '' } 
                                onClick={(e) => {this.props.setComponent(e); this.toggleTab(1)}} 
                                name='favorites'
                                >{NAVSECTION.BUTTON4[this.props.userObj.lang]}</button>
                                <button
                                className={ this.props.currentComponent === 'anniversaries'? 'active' : '' } 
                                onClick={(e) => {this.props.setComponent(e); this.toggleTab(1)}} 
                                name='anniversaries'
                                >{NAVSECTION.BUTTON5[this.props.userObj.lang]}</button>
                            </div>
                            <button 
                                className={ this.state.navTabActive === 1? 'navActive' : '' }
                                onClick={() => this.toggleTab(1)}
                                >
                                <img src="https://image.flaticon.com/icons/svg/1530/1530694.svg" alt="relationship icon" id="relationship"/>
                                <p>{NAVSECTION.BUTTON6[this.props.userObj.lang]}</p>
                            </button>
                            
                        </section>
                        <section>
                                <button
                                    onClick={() => this.props.setComponent( { target: { name: 'chat' } } ) } 
                                >
                                    <img src="https://image.flaticon.com/icons/svg/126/126500.svg" alt="chat icon" id="chat"/>
                                    <p>{NAVSECTION.BUTTON7[this.props.userObj.lang]}</p>
                                </button>
                        </section>
                        <section>
                            <button
                                onClick={() => this.props.setComponent( {target: { name: 'calendar'} } ) }
                            >
                                <img src="https://image.flaticon.com/icons/svg/747/747310.svg" alt="organize icon" id="organize"/>
                                <p>{NAVSECTION.BUTTON8[this.props.userObj.lang]}</p>
                            </button>
                        </section>
                        <section>
                            <div className={ this.state.navTabActive === 4? 'navOpen lastOnRight' : 'navClose'}>
                                <button
                                onClick={this.logOut} 
                                >{NAVSECTION.BUTTON9[this.props.userObj.lang]}</button>
                                <button
                                className={ this.props.currentComponent === 'settings'? 'active' : '' } 
                                onClick={(e) => {this.props.setComponent(e); this.toggleTab(4)} } 
                                name='settings'
                                >{NAVSECTION.BUTTON10[this.props.userObj.lang]}</button>
                            </div>
                            <button
                                className={ this.state.navTabActive === 4? 'navActive' : '' }
                                onClick={() => this.toggleTab(4)}
                            >
                                <img src="https://image.flaticon.com/icons/svg/149/149947.svg" alt="more options" id="more"/>
                                <p>{NAVSECTION.BUTTON11[this.props.userObj.lang]}</p>
                            </button>
                        </section>
                    </nav>

                    <div className="partnerLabel">
                        <p>{NAVSECTION.P2_partner[this.props.userObj.lang]}</p>
                        {partnerLabel}
                    </div>
               </section>
        );
    }
}

export default withRouter(NavSection);