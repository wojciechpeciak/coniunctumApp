import React, {Component, Fragment} from 'react';
import { getAnniversaries, updateAnniversaries } from './UserFunctions';
import deleteButton from '../assets/delete-button.png';
import addButton from '../assets/plus-button.png';
import { RELATIONSHIPCARD, REGISTER } from '../TextContent';
//import './RelatinshipCards.css';


class AnniversariesCard extends Component{

    constructor(props){
        super(props);

        this.state = {
            anniversaries: [],
            submited: false
        }

        this.onChangeArray = this.onChangeArray.bind(this);
        this.onDeleteArray = this.onDeleteArray.bind(this);
        this.onAddArray = this.onAddArray.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount(){
        getAnniversaries(this.props.user.relationshipId)
        .then( cardObj => {
            if (cardObj !== undefined) {
                this.setState({
                    anniversaries: cardObj.anniversaries,
                })
            }
        });
    }
    /*componentWillReceiveProps(nextProps){
        if (nextProps.cardName !== this.props.cardName) {
            getRelationshipCard(this.props.user.relationshipId, this.props.user.userId, nextProps.cardName)
            .then( cardObj => {
                if (cardObj !== undefined) {
                    this.setState({
                        userItems: cardObj.user,
                        partnerItems: cardObj.partner,
                        cardOpen: this.state.cardOpen,
                        submited: false
                    })
                }
            });
        }
    }*/

    onChangeArray(index, fieldName, newValue){
        this.setState(prevState => {
            const copyArray = [...prevState.anniversaries];
            copyArray[index][fieldName] = newValue;
            return { 
                anniversaries: copyArray,
                submited: false
            };
        });
    
    }
    onDeleteArray(index){
        const copyArray = [...this.state.anniversaries];
        copyArray.splice(index, 1);
        // added later
        updateAnniversaries(this.props.user.relationshipId, copyArray)
        .then( resp => {
            if (resp.cardUpdated !== undefined) {
                this.setState({
                    anniversaries: copyArray,
                    submited: false
                });
            }
        });
   
    }
    onAddArray(defaultObj){
        this.setState(prevState => {
            const copyArray = [...prevState.anniversaries];
            copyArray.push( defaultObj );
            return { 
                anniversaries: copyArray,
                submited: false
            };
        });
    }

    onSubmit(e){
        e.preventDefault();
        const anniversaries = [...this.state.anniversaries].map( elem => {
            elem.date = new Date(elem.date)
            return elem;
        });
        
        updateAnniversaries(this.props.user.relationshipId, anniversaries)
        .then( resp => {
            if (resp.cardUpdated !== undefined) {
                this.setState( { submited: true })
            }
        });
    }

    render(){
        const {lang} = this.props.user;
        const defaultObj = { title: '', date: ''};
        const confirmation = (
            <div className="confirmation">
                <p>{RELATIONSHIPCARD.CONFIRMATION1[lang]}</p>
            </div>
        );

        return (
            <Fragment>
                <form 
                className="formStep relationshipCard"
                onSubmit={this.onSubmit}
            >
                <h1 className="title">{REGISTER.step3_H11[lang]}</h1>
                <p>{RELATIONSHIPCARD.P5_annivarsaries[lang]}</p>
                {this.state.anniversaries.length !== 0?
                    this.state.anniversaries.map( (elem, key) => {
                        // Format date
                        let date = new Date(elem.date);
                        const day = date.getDate();
                        const month = date.getMonth() + 1;
                        date = date.getFullYear() + '-' + (month > 9? '' : '0') + month + '-' + (day > 9? '' : '0') + day;
                        //
                    return (
                        <div className="listItem" key={key}>
                            <div className="inputItemSection">
                                <div className="inputItem">
                                    <label htmlFor={'title'+key}>{REGISTER.step3_LABEL1[lang]}</label>
                                    <input type="text" name="title" id={'title'+key} required value={elem.title} onChange={(e) => this.onChangeArray(key, 'title', e.target.value)} />
                                </div>
                                <div className="inputItem">
                                    <label htmlFor={'content'+key}>{REGISTER.step3_LABEL2[lang]}</label>
                                    <input type="date" name="content" id={'content'+key} required value={date} onChange={(e) => this.onChangeArray(key, 'date', e.target.value)}/>
                                </div>
                            </div>
                            <input type="image" src={deleteButton} alt="Delete button img" onClick={(e) => { e.preventDefault(); this.onDeleteArray(key) }}/>
                        </div>
                    ); }):
                    <h1>{RELATIONSHIPCARD.H1_annivarsaries[lang]}</h1>
                }
                    <input id="addItem" className='cardItemAdd' type="image" src={addButton} alt="Add button img" onClick={(e) => { e.preventDefault(); this.onAddArray(defaultObj) }}/> 
                    {this.state.submited && confirmation}
                    <button type="submit" onSubmit={this.onSubmit} className='submitButton'>{RELATIONSHIPCARD.BUTTON1[lang]}</button>
                </form>
            </Fragment>
        );
    }
}

export default AnniversariesCard;