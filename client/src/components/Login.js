import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { login, resolveUserToken } from './UserFunctions';
import Navbar from './Navbar';
import Footer from './Footer';
import './Login.css';
import { LOGIN } from '../TextContent';


class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            errors: false
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ 
            [e.target.name]: e.target.value,
            errors: false
         });
    }

    onSubmit(e){
        e.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password
        }
        login(user).then(res => {
            if(res.error === undefined){
                this.props.history.push('/coniunctum');
            }
            else{
                this.setState({errors: true});
            }
        });
    }

    componentWillMount(){
        const user = resolveUserToken(localStorage);
        if (user) {
            this.props.history.push('/coniunctum');
        }
    }

    render() {
        const {lang} = this.props.match.params;

        const alert = (
            <div className="alert">
                <p>{LOGIN.ALERT1[lang]}</p>
            </div>
        );

        return (
            <div >
                <Navbar login={true} />
                <main className="login">
                    <h1 className="title">{LOGIN.TITLE1[lang]}</h1>
                    {this.state.errors && alert}
                    <form className="loginForm" onSubmit={this.onSubmit}>
                        <label htmlFor="email">{LOGIN.LABEL1[lang]}</label>
                        <input 
                            type="email" 
                            className="form-control"
                            name="email"
                            required
                            value={this.state.email}
                            onChange={this.onChange}
                        />
                        <label htmlFor="password">{LOGIN.LABEL2[lang]}</label>
                        <input 
                            type="password" 
                            className="form-control"
                            name="password"
                            required
                            value={this.state.password}
                            onChange={this.onChange}
                        />
                        <Link to={this.props.match.params.lang === 'en'? '/resetpass/en' : '/resetpass/pl'}>{LOGIN.LINK1[lang]}</Link>
                        <input type="submit" value={LOGIN.INPUT1[lang]} className="submit"/>
                    </form>
                </main>
                <Footer />
            </div>
        )}
}

export default Login;