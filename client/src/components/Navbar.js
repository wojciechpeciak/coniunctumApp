import React, {Component} from 'react';
import { Link, withRouter } from 'react-router-dom'
import './Navbar.css'
import { NAVBAR } from '../TextContent';

class Navbar extends Component {

    constructor(props){
        super(props);

        this.state = {
            navbarOpen: false
        }

        this.logOut = this.logOut.bind(this);
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.toggleLang = this.toggleLang.bind(this);
    }

    logOut(e) {
        e.preventDefault();
        localStorage.removeItem('usertoken');
        this.props.history.push('/home');
    }

    toggleNavbar(){
        this.setState(prevState => ({ navbarOpen: !prevState.navbarOpen}));
    }
    toggleLang(){
       const temp = this.props.match.params.lang !== 'en' ? this.props.match.path.replace( '/:lang?', '') + '/en' : this.props.match.path.replace( '/:lang?', '') + '/pl';       
       this.props.history.push(
           temp
       );
    }

    render() {
        const lang = this.props.match.params.lang;
        return (
            <div className="publicNavBar">
                <nav className={this.state.navbarOpen? 'navList navbarOpen' : 'navList'}>
                    <input type="image" 
                    src={this.state.navbarOpen? "https://image.flaticon.com/icons/svg/271/271218.svg" : "https://image.flaticon.com/icons/svg/56/56763.svg"}
                    alt="Menu button" onClick={this.toggleNavbar}/>
                    <div className="navLinks">
                        <Link to={this.props.match.params.lang === 'en'? '/home/en' : '/home/pl'} className={ this.props.home? 'active' : ''}>{NAVBAR.LINK1[lang]}</Link>
                        <Link to={this.props.match.params.lang === 'en'? '/about/en' : '/about/pl'} className={ this.props.about? 'active' : ''}>{NAVBAR.LINK2[lang]}</Link>
                        <Link to={this.props.match.params.lang === 'en'? '/contact/en' : '/contact/pl'} className={ this.props.contact? 'active' : ''}>{NAVBAR.LINK3[lang]}</Link>
                        <Link to={this.props.match.params.lang === 'en'? '/login/en' : '/login/pl'} className={ this.props.login? 'active' : ''}>{NAVBAR.LINK4[lang]}</Link>
                        <Link to={this.props.match.params.lang === 'en'? '/register/en' : '/register/pl'} className={ this.props.register? 'active' : ''}>{NAVBAR.LINK5[lang]}</Link>
                    </div>
                </nav>
                <a href={this.props.match.params.lang === 'en'? '/home/en' : '/home/pl'}>
                <div className="brand" >
                    <img src="https://image.flaticon.com/icons/svg/766/766583.svg" alt="Brand logo"/>
                    <span>Coniunctum</span>
                </div>
                </a>
                <div className="lang" onClick={this.toggleLang}>
                    <span id="pl" className={this.props.match.params.lang !== 'en'? 'langActive' : ''}>PL</span>
                    <span> / </span>
                    <span id="en"  className={this.props.match.params.lang === 'en'? 'langActive' : ''}>EN</span>
                </div>
            </div>
        );
    }
}

export default withRouter(Navbar);