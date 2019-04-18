import React, {Component} from 'react';
import Navbar from './Navbar';
import './About.css';

import Footer from './Footer';
import feedback from '../assets/feedback.jpg';
import author from '../assets/wojciech-peciak.png';
import login from '../assets/login.jpg';
import landing from '../assets/landing.jpg';
import resetPass from '../assets/resetPass.jpg';
import avatar from "../assets/user.svg";
import deleteButton from "../assets/delete-button.png";
import addButton from "../assets/plus-button.png";
import { ABOUT } from '../TextContent';

class About extends Component {

    render(){
        const {lang} = this.props.match.params;
        return(
            <div>
                <Navbar about={true}/>
                <main className="about">
                    <section className="description">
                        <div className="author">
                            <img src={author} alt="Author Wojeciech Pęciak"/>
                            <h1>{ABOUT.H11[lang]}</h1>
                        </div>
                        <div className="project">
                            <p>{ABOUT.P1_1[lang]}&nbsp;
                                <a href="mailto:peciak@gmail.com">Wojciech Pęciak</a>
                                &nbsp; {ABOUT.P1_2[lang]}</p>
                            <p>{ABOUT.P2[lang]}</p>
                        </div>
                    </section>
                    <section className="credits">
                        <h2>{ABOUT.H2[lang]}</h2>
                        <div>
                        <p>
                            <img src="https://image.flaticon.com/icons/svg/766/766583.svg" alt="Heart icon"/>
                            &nbsp;  {ABOUT.P3_icon_1[lang]}
                            <a href="https://www.flaticon.com/authors/good-ware"> Good Ware</a> {ABOUT.P3_icon_2[lang]} 
                            <a href="http://www.flaticon.com/"> www.flaticon.com</a>
                        </p>
                        <p>
                            <img src="https://image.flaticon.com/icons/svg/271/271218.svg" alt="Arrow icon"/>
                            &nbsp;{ABOUT.P3_icon_1[lang]}  
                            <a href="https://www.flaticon.com/authors/roundicons"> Roundicons</a> {ABOUT.P3_icon_2[lang]} 
                            <a href="http://www.flaticon.com/"> www.flaticon.com</a>
                        </p>
                        <p>
                            <img src="https://image.flaticon.com/icons/svg/56/56763.svg" alt="Menu icon"/>
                            &nbsp;{ABOUT.P3_icon_1[lang]}  
                            <a href="https://www.flaticon.com/authors/freepik"> Freepick</a> {ABOUT.P3_icon_2[lang]} 
                            <a href="http://www.flaticon.com/"> www.flaticon.com</a>
                        </p>
                        <p>
                            <img src={avatar} alt="Default avatar icon"/>
                            &nbsp;{ABOUT.P3_icon_1[lang]}  
                            <a href="https://www.flaticon.com/authors/smashicons"> Smashicons</a> {ABOUT.P3_icon_2[lang]} 
                            <a href="http://www.flaticon.com/"> www.flaticon.com</a>
                        </p>
                        <p>
                            <img src={deleteButton} alt="Delete button icon"/>
                            &nbsp;{ABOUT.P3_icon_1[lang]}  
                            <a href="https://www.flaticon.com/authors/pavel-kozlov"> Pavel Kozlov</a> {ABOUT.P3_icon_2[lang]} 
                            <a href="http://www.flaticon.com/"> www.flaticon.com</a>
                        </p>
                        <p>
                            <img src={addButton} alt="Add button icon"/>
                            &nbsp;{ABOUT.P3_icon_1[lang]}  
                            <a href="https://www.flaticon.com/authors/minh-hoang"> Minh Hoang</a> {ABOUT.P3_icon_2[lang]} 
                            <a href="http://www.flaticon.com/"> www.flaticon.com</a>
                        </p>
                        <p>
                            <img src={feedback} alt="feedback"/> 
                            &nbsp; {ABOUT.P4_image_1[lang]} <a href="https://pixabay.com/users/MIH83-464187/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1213042">Maret Hosemann</a> {ABOUT.P4_image_2[lang]} <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1213042">Pixabay</a>
                        </p>
                        <p>
                            <img src={login} alt="login"/> 
                            &nbsp; {ABOUT.P4_image_1[lang]} <a href="https://unsplash.com/@moren">moren hsu</a> {ABOUT.P4_image_2[lang]} <a href="https://unsplash.com/">Unsplash</a>
                        </p>
                        <p>
                            <img src={landing} alt="landing"/> 
                            &nbsp; {ABOUT.P4_image_1[lang]} <a href="https://unsplash.com/@alexiby">Alex Iby</a> {ABOUT.P4_image_2[lang]} <a href="https://unsplash.com/">Unsplash</a>
                        </p>
                        <p>
                            <img src={resetPass} alt="password reseting"/> 
                            &nbsp; {ABOUT.P4_image_1[lang]} <a href="https://unsplash.com/@chilinik">Nikita Kostrykin</a> {ABOUT.P4_image_2[lang]} <a href="https://unsplash.com/">Unsplash</a>
                        </p>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }
}

export default About;