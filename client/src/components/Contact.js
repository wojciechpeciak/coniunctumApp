import React, {Component} from 'react';
import Navbar from './Navbar';
import './Contact.css'
import feedback from '../assets/feedback.jpg';
import Footer from './Footer';
import { CONTACT } from '../TextContent';


class Contact extends Component {

    constructor(props){
        super(props)

        this.state={
            email: '',
            header: '',
            content: '',
            requestSend: false
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit(e){
        e.preventDefault();

        /*const newRequest = {
            email: this.state.email,
            header: this.state.header,
            content: this.state.content
        }*/
        this.setState({requestSend: true});
        console.log('Request recieved!');
    }

    onChange(e){
        this.setState({
            [e.target.name]: e.target.value,
            requestSend: false
        })

    }

    render(){
        const {lang} = this.props.match.params;
        const confirmation = (
            <div className="confirmation">
                <p>{CONTACT.P1[lang]}</p>
            </div>
        );
        return(
            <div>
                <Navbar contact={true}/>
                <main className="contactForm">
                    <img src={feedback} alt="Post box with word 'feedback' next to it"/>
                    
                    <form onSubmit={this.onSubmit}>
                    {/*confirmation?*/
                        this.state.requestSend && confirmation
                    }
                        <fieldset>
                            <legend>{CONTACT.LEGEND1[lang]}</legend>   
                            <label htmlFor="email">{CONTACT.LABEL1[lang]}</label>
                            <input type="email" name="email" id="email" required value={this.state.email} onChange={this.onChange}/>
                            <label htmlFor="header">{CONTACT.LABEL2[lang]}</label>
                            <input type="text" name="header" id="header" required value={this.state.header} onChange={this.onChange}/>
                            <label htmlFor="content">{CONTACT.LABEL3[lang]}</label>
                            <textarea type="text" name="content" id="content" required value={this.state.content} onChange={this.onChange}/>
                            <input className="submit" type="submit" value={ CONTACT.BUTTON1[lang] }/>
                        </fieldset>    
                    </form>
                </main>
                <Footer />
            </div>
        );
    }

}
export default Contact