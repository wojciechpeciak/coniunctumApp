import React, {Component, Fragment} from 'react';
import { getSettings, updateSettings } from './UserFunctions';
import './Settings.css';
import { SETTINGS } from '../TextContent';


class Settings extends Component{
    constructor(props){
        super(props);

        this.state = {
            lang: 'pl',
            intercourseHistory: false,
            menstrualCycle: false,
            menstrualCycleBeginnig: '1994-04-15',
            periodDays: 5,
            cycleDays: 25,
            contraceptionCycle: false,
            contraceptionCycleBeginning: '1994-05-15',
            daysOnPill: 21,
            daysOffPill: 7,

            contraceptionConfig: false,
            menstrualConfig: false
        };

        this.onChange = this.onChange.bind(this);
        this.toggleBool = this.toggleBool.bind(this);
        this.toggleLang = this.toggleLang.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(){
        getSettings(this.props.user.relationshipId, this.props.user.userId)
        .then( res => {
            if (res !== undefined) {
                this.setState({
                    lang: res.lang,
                    intercourseHistory: res.intercourseHistory,
                    menstrualCycle: res.menstrualCycle,
                    menstrualCycleBeginnig: res.menstrualCycleBeginnig,
                    periodDays: res.periodDays,
                    cycleDays: res.cycleDays,
                    contraceptionCycle: res.contraceptionCycle,
                    contraceptionCycleBeginning: res.contraceptionCycleBeginning,
                    daysOnPill: res.daysOnPill,
                    daysOffPill: res.daysOffPill
                })
            }
        });
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    
    }

    toggleLang(e){
        e.preventDefault();
        this.setState( prevState => ({ lang: prevState.lang === 'en'? 'pl' : 'en' }) );
    }

    toggleBool(e) {
        e.preventDefault();
        const name = e.currentTarget.name;
        this.setState( prevState => ({ [name]: !prevState[name] }) );
    }

    onSubmit(e){
        e.preventDefault();
        // prepare obj
        const configObj = {
            lang: this.state.lang,
            intercourseHistory: this.state.intercourseHistory,
            menstrualCycle: this.state.menstrualCycle,
            contraceptionCycle: this.state.contraceptionCycle,
        };
        // contraception part
        if( this.state.contraceptionCycle ){
            configObj.contraceptionCycleBeginning = new Date(this.state.contraceptionCycleBeginning);
            configObj.daysOnPill = this.state.daysOnPill;
            configObj.daysOffPill = this.state.daysOffPill;
        }
        // menstrual part
        if( this.state.menstrualCycle ){
            configObj.menstrualCycleBeginnig = new Date(this.state.menstrualCycleBeginnig);
            configObj.periodDays = this.state.periodDays;
            configObj.cycleDays = this.state.cycleDays;
        }
                 
        updateSettings(this.props.user.relationshipId, this.props.user.userId, configObj)
        .then( resp => {
            if (resp.cardUpdated !== undefined) {
                window.location.reload(true);
            }
        });
    }

    render(){
        const {lang} = this.props.user;
        // Format dates
        let date = new Date(this.state.contraceptionCycleBeginning);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        const  inputContraceptionBeginnig = date.getFullYear() + '-' + (month > 9? '' : '0') + month + '-' + (day > 9? '' : '0') + day;

        date = new Date(this.state.menstrualCycleBeginnig);
        day = date.getDate();
        month = date.getMonth() + 1;
        const  inputMenstrualBeginnig = date.getFullYear() + '-' + (month > 9? '' : '0') + month + '-' + (day > 9? '' : '0') + day; 


        return (
            <form className="settings" onSubmit={this.onSubmit}>
                <h1 className="cardTitle">{SETTINGS.H11[lang]}</h1>
                <button className="optionSwitch" onClick={this.toggleLang}>
                    <p>{SETTINGS.P1[lang]}</p>
                    <div className="optionToggle">
                        <p className={this.state.lang === 'en'? 'option checked' : 'option'}>EN</p>
                        <p className={this.state.lang === 'pl'? 'option checked' : 'option'}>PL</p>
                    </div>
                </button>
                <button className="optionSwitch" onClick={this.toggleBool} name='intercourseHistory'>
                    <p>{SETTINGS.P2[lang]}</p>
                    <div className="optionToggle">
                        <p className={this.state.intercourseHistory === true? 'option checked' : 'option'}>ON</p>
                        <p className={this.state.intercourseHistory === false? 'option checked' : 'option'}>OFF</p>
                    </div>
                </button>
                { /*this.props.user.sex === 'female' &&*/ <div className={this.state.contraceptionConfig ? "cycleConfig configOpen" : "cycleConfig"}>
                    <button className="cycleSetting" onClick={this.toggleBool} name='contraceptionConfig'><p>{SETTINGS.P3[lang]}</p></button>
                    { this.state.contraceptionConfig && 
                        <Fragment>
                        <div className="activate">
                            <label htmlFor="contraceptionCycle">{SETTINGS.LABEL1[lang]}</label>
                            <input type="checkbox" name="contraceptionCycle" id="contraceptionCycle" value="contraceptionCycle" checked={this.state.contraceptionCycle} onChange={(e) => { const name = e.target.name; this.setState( prevState => ({ [name]: !prevState[name] }) );}}/>
                        </div>
                        <div className="configItem">
                            <label htmlFor="contraceptionCycleBeginning">{SETTINGS.LABEL2[lang]}</label>
                            <input disabled={!this.state.contraceptionCycle} required={this.state.contraceptionCycle} type="date" name="contraceptionCycleBeginning" id="contraceptionCycleBeginning" value={inputContraceptionBeginnig} onChange={this.onChange}/>
                        </div>
                        <div className="configItem">
                            <label htmlFor="daysOnPill">{SETTINGS.LABEL3[lang]}</label>
                            <input disabled={!this.state.contraceptionCycle} required={this.state.contraceptionCycle} type="number" name="daysOnPill" id="daysOnPill" min="0" value={this.state.daysOnPill} onChange={this.onChange}/>
                        </div>
                        <div className="configItem">
                            <label htmlFor="daysOffPill">{SETTINGS.LABEL4[lang]}</label>
                            <input disabled={!this.state.contraceptionCycle} required={this.state.contraceptionCycle} type="number" name="daysOffPill" id="daysOffPill" min="0" value={this.state.daysOffPill} onChange={this.onChange} />
                        </div>
                        </Fragment>}
                 </div>}
                { /*this.props.user.sex === 'female' &&*/ <div className={this.state.menstrualConfig ? "cycleConfig configOpen" : "cycleConfig"}>
                    <button className="cycleSetting" onClick={this.toggleBool} name='menstrualConfig'><p>{SETTINGS.P4[lang]}</p></button>
                    { this.state.menstrualConfig && 
                        <Fragment>
                        <div className="activate">
                            <label htmlFor="menstrualCycle">{SETTINGS.LABEL1[lang]}</label>
                            <input type="checkbox" name="menstrualCycle" id="menstrualCycle" value="menstrualCycle" checked={this.state.menstrualCycle} onChange={(e) => { const name = e.target.name; this.setState( prevState => ({ [name]: !prevState[name] }) );}}/>
                        </div>
                        <div className="configItem">
                            <label htmlFor="menstrualCycleBeginnig">{SETTINGS.LABEL5[lang]}</label>
                            <input disabled={!this.state.menstrualCycle} required={this.state.menstrualCycle} type="date" name="menstrualCycleBeginnig" id="menstrualCycleBeginnig" value={inputMenstrualBeginnig} onChange={this.onChange}/>
                        </div>
                        <div className="configItem">
                            <label htmlFor="periodDays">{SETTINGS.LABEL6[lang]}</label>
                            <input disabled={!this.state.menstrualCycle} required={this.state.menstrualCycle} type="number" name="periodDays" id="periodDays" min="1" max="10" value={this.state.periodDays} onChange={this.onChange}/>
                        </div>
                        <div className="configItem">
                            <label htmlFor="cycleDays">{SETTINGS.LABEL7[lang]}</label>
                            <input disabled={!this.state.menstrualCycle} required={this.state.menstrualCycle} type="number" name="cycleDays" id="cycleDays" min="21" max="45" value={this.state.cycleDays} onChange={this.onChange} />
                        </div>
                        </Fragment>}
                 </div>}
                <button type="submit">{SETTINGS.BUTTON1[lang]}</button>
            </form>
        );
    }
}

export default Settings;