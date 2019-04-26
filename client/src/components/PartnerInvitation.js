import React, {Component, Fragment} from 'react';
import { pairPartner } from './UserFunctions';
import './PartnerInvitation.css';
import { PARTNERINVIT } from '../TextContent';



class PartnerInvitation extends Component{
    constructor(props){
        super(props);

        this.state = {
            invitCode: '',
            incorrectCode: false,
            ispaired: false
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e){
        this.setState({ 
            [e.target.name]: e.target.value,
            incorrectCode: false
        });
    }

    onSubmit(e){
        e.preventDefault();

        if (this.state.invitCode !== this.props.invitCode) {
            pairPartner(this.props.relationshipId, this.state.invitCode).then(response => {
                if(response.partnerPaired){
                    this.setState({ ispaired: true }, () =>{
                        window.setTimeout(()=>window.location.reload(), 3000)
                    });
                    //this.props.setComponent( { target: { name: 'chat' } } )
                }
                else {
                    this.setState( { incorrectCode: true } );
                }
                
                console.log('Pairing partner request completed?');
               // this.props.history.push('/');
                
            })
            .catch(err => {
                console.log('Error durin pair partner request: ' + err);
                
            });
        } else {
            this.setState( { incorrectCode: true } );            
        }
    }

    render(){

        const alert = (
            <div className="alert invitAlert">
                <p>{PARTNERINVIT.ALERT1[this.props.lang]}</p>
            </div>
        );

        const confirmation = (
            <div className="confirmation">
                <p>{PARTNERINVIT.CONFIRMATION[this.props.lang]}</p>
            </div>
        );

        return (
        <Fragment>
            <section className="invitOption">
                <h1>{PARTNERINVIT.H11[this.props.lang]}</h1>
                <p className='invitCode'>{this.props.invitCode}</p>
                <p>{PARTNERINVIT.P1[this.props.lang]}</p>
            </section>
            <hr/>
            <section className="invitOption">
                <h1>{PARTNERINVIT.H12[this.props.lang]}</h1>
                <p>{PARTNERINVIT.P2[this.props.lang]}</p>
                { this.state.incorrectCode && alert }
                { this.state.ispaired && confirmation }
                <form className="invitInput" onSubmit={this.onSubmit}>
                    <label htmlFor="invitCode">{PARTNERINVIT.LABEL1[this.props.lang]}</label>
                    <input type="text" name="invitCode" id="invitCode" value={this.state.invitCode} onChange={this.onChange}/>
                    <button type="submit" className='greenButton'>{PARTNERINVIT.BUTTON1[this.props.lang]}</button>
                </form>
            </section>
        </Fragment>
        );
        
    }

}

export default PartnerInvitation;