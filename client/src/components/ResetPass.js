import React, {Component} from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './ResetPass.css';
import { RESETPASS } from '../TextContent';

class ResetPass extends Component {

    constructor(props){
        super(props);

        this.state = {
            email: '',
            resetSend: false
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ 
            [e.target.name]: e.target.value,
            resetSend: false
         });
    }

    onSubmit(e){
        e.preventDefault();
        /*const user = {
            email: this.state.email,
            password: this.state.password
        }
        login(user).then(res => {
            if(res.error === undefined){
                this.props.history.push('/profile');
            }
            else{
                this.setState({errors: true});
            }
        });*/
        this.setState({ resetSend: true});
    }

    render(){
        const {lang} = this.props.match.params;
        const confirmation = (
            <div className="confirmation">
                <p>{RESETPASS.P1_confirmation[lang]}</p>
            </div>
        );

        return(
            <div>
                <Navbar login={true}/>
                <main className="resetPass">
                    <h1 className="title">{RESETPASS.H11[lang]}</h1>
                    {this.state.resetSend && confirmation}
                    <p>{RESETPASS.P2[lang]}</p>
                    <form className="resetForm" onSubmit={this.onSubmit}>
                        <label htmlFor="email">{RESETPASS.LABEL1[lang]}</label>
                        <input 
                            type="email" 
                            className="form-control"
                            name="email"
                            required
                            value={this.state.email}
                            onChange={this.onChange}
                        />
                        <input type="submit" value={RESETPASS.INPUT1[lang]} className="submit"/>
                    </form>
                </main>
                <Footer/>
            </div>
        );
    }
}

export default ResetPass;