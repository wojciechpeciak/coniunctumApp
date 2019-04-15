import React, {Component, Fragment} from 'react';
import { getRelationshipCard, updateRelationshipCard } from './UserFunctions';
import deleteButton from '../assets/delete-button.png';
import addButton from '../assets/plus-button.png';
import './RelatinshipCards.css';
import { REGISTER, RELATIONSHIPCARD } from '../TextContent';


class RelatinshipCards extends Component{

    constructor(props){
        super(props);

        this.state = {
            userItems: [],
            partnerItems: [],
            cardOpen: 'partner',
            submited: false
        }

        this.onChangeArray = this.onChangeArray.bind(this);
        this.onDeleteArray = this.onDeleteArray.bind(this);
        this.onAddArray = this.onAddArray.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.cardSwitch = this.cardSwitch.bind(this);
    }

    componentDidMount(){
        getRelationshipCard(this.props.user.relationshipId, this.props.user.userId, this.props.cardName)
        .then( cardObj => {
            if (cardObj !== undefined) {
                this.setState({
                    userItems: cardObj.user,
                    partnerItems: cardObj.partner
                })
            }
        });
    }
    componentWillReceiveProps(nextProps){
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
    }

    onChangeArray(index, fieldName, newValue){
        this.setState(prevState => {
            const copyArray = [...prevState.userItems];
            copyArray[index][fieldName] = newValue;
            return { 
                userItems: copyArray,
                submited: false
            };
        });
    
    }
    onDeleteArray(index){
        const copyArray = [...this.state.userItems];
        copyArray.splice(index, 1);
        // added later
        updateRelationshipCard(this.props.user.relationshipId, this.props.user.userId, copyArray, this.props.cardName)
        .then( resp => {
            if (resp.cardUpdated !== undefined) {
                this.setState({
                    userItems: copyArray,
                    submited: false
                });
            }
        });
   
    }
    onAddArray(defaultObj){
        this.setState(prevState => {
            const copyArray = [...prevState.userItems];
            copyArray.push( defaultObj );
            return { 
                userItems: copyArray,
                submited: false
            };
        });
    }

    onSubmit(e){
        e.preventDefault();
        updateRelationshipCard(this.props.user.relationshipId, this.props.user.userId, this.state.userItems, this.props.cardName)
        .then( resp => {
            if (resp.cardUpdated !== undefined) {
                this.setState( { submited: true })
            }
        });
    }

    cardSwitch(e){
        this.setState( { cardOpen: e.target.name } );
    }

    render(){
        const {lang} = this.props.user;
        const defaultObj = { title: '', content: ''};
        const confirmation = (
            <div className="confirmation">
                <p></p>
            </div>
        );
        const headersObj = {
            'wardrobe': <Fragment>
                            <h1 className="title">{REGISTER.step5_H11[lang]}</h1>
                            <p>{RELATIONSHIPCARD.P1_wardrobe[lang]}</p>
                        </Fragment>,
            'lifeInfo': <Fragment>
                            <h1 className="title">{REGISTER.step6_H11[lang]}</h1>
                            <p>{RELATIONSHIPCARD.P2_lifeInfo[lang]}</p>
                        </Fragment>,
            'favorites': <Fragment>
                            <h1 className="title">{REGISTER.step4_H11[lang]}</h1>
                            <p>{RELATIONSHIPCARD.P3_fav[lang]}</p>
                        </Fragment>,
                'gift': <Fragment>
                            <h1 className="title">{RELATIONSHIPCARD.H1_gift[lang]}</h1>
                            <p>{RELATIONSHIPCARD.P4_gift[lang]}</p>
                        </Fragment>
        }

        const user = (
        <Fragment>
            <form 
                className="formStep relationshipCard"
                onSubmit={this.onSubmit}
            >
                {headersObj[this.props.cardName]}
                {this.state.userItems.map( (elem, key) => {
                    return (
                        <div className="listItem" key={key}>
                            <div className="inputItemSection">
                                <div className="inputItem">
                                    <label htmlFor={'title'+key}>{REGISTER.step3_LABEL1[lang]}</label>
                                    <input type="text" name="title" id={'title'+key} required value={elem.title} onChange={(e) => this.onChangeArray(key, 'title', e.target.value)} />
                                </div>
                                <div className="inputItem">
                                    <label htmlFor={'content'+key}>{REGISTER.step4_LABEL1[lang]}</label>
                                    <textarea type="text" name="content" id={'content'+key} required value={elem.content} onChange={(e) => this.onChangeArray(key, 'content', e.target.value)}/>
                                </div>
                            </div>
                            <input type="image" src={deleteButton} alt="Delete button img" onClick={(e) => { e.preventDefault(); this.onDeleteArray(key) }}/>
                        </div>
                    );
                })}
                    <input id="addItem" className='cardItemAdd' type="image" src={addButton} alt="Add button img" onClick={(e) => { e.preventDefault(); this.onAddArray(defaultObj) }}/> 
                    {this.state.submited && confirmation}
                    <button type="submit" onSubmit={this.onSubmit} className='submitButton'>{RELATIONSHIPCARD.BUTTON1[lang]}</button>
            </form>
        </Fragment>
        );

        const partner = (
            <Fragment>
            <div 
                className="formStep relationshipCard"
            >
                {headersObj[this.props.cardName]}
                <div className="partnerCardItems">
                { this.state.partnerItems.length !== 0?
                    this.state.partnerItems.map( (elem, key) => {
                        return (
                            <div className="partnerListItem" key={key}>
                                    <div className="cardItem">
                                        <p className="title">{elem.title}</p>
                                        <p className="content">{elem.content}</p>
                                    </div>
                            </div>
                        );
                    }):
                    <h1>{RELATIONSHIPCARD.H1_partner[lang]}</h1>
                }
                </div>
            </div>
            </Fragment>
        );

        return (
            <Fragment>
            <section className="cardSwitch">
                <button id='leftButton' name='partner' onClick={this.cardSwitch} className={this.state.cardOpen !== 'user'? 'active' : ''}>{RELATIONSHIPCARD.BUTTON2[lang]}</button>
                <button id='rightButton' name='user' onClick={this.cardSwitch} className={this.state.cardOpen === 'user'? 'active' : ''}>{RELATIONSHIPCARD.BUTTON3[lang]}</button>
            </section>
            {this.state.cardOpen === 'user'? user : partner}
            </Fragment>
        );
    }
}

export default RelatinshipCards;