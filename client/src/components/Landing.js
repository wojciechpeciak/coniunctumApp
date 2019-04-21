import React, {Component} from 'react';
import Navbar from './Navbar';
import { resolveUserToken } from './UserFunctions';
import landing from '../assets/landing.jpg'
import './Landing.css';
import Footer from './Footer';
import { LANDING } from '../TextContent'

class Landing extends Component {

    componentWillMount(){
        const user = resolveUserToken(localStorage);
        if(user)
            this.props.history.push('/coniunctum')
    }

    render () {
        const {lang} = this.props.match.params;
        return (
            <div>
                <Navbar home={true}/>
                <main className="public">
                    <img src={landing} alt="Couple holding hands at the sun set"/>
                    <div className="textContent">
                        <h1>{LANDING.TITLE_1[lang]}<br/>{LANDING.TITLE_2[lang]}</h1>
                        <p>{LANDING.P1[lang]}</p>
                        <p>{LANDING.P2[lang]}
                        </p>
                            <ul>
                                <li>{LANDING.LI1[lang]}</li>
                                <li>{LANDING.LI2[lang]}</li>
                                <li>{LANDING.LI3[lang]}</li>
                                <li>{LANDING.LI4[lang]}</li>
                            </ul>
                    </div>
                </main> 
                <Footer />
            </div>
        );
    }
}

export default Landing;