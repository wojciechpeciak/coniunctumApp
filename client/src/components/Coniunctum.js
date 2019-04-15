import React, {Component} from 'react';
import '../chat.css'
import HeaderBar from './HeaderBar';
import NavSection from './NavSection';
import ChatSection from './ChatSection';
import { resolveUserToken, getBigDate, getPartnersLabels, getInvitCode, getSettings } from './UserFunctions';
import PartnerInvitation from './PartnerInvitation';
import RelatinshipCards from './RelationshipCards';
import AnniversariesCard from './AnniversariesCard';
import Calendar from './CalendarSection';
import Settings from './Settings';
import { CONIUNCTUM } from '../TextContent';
import moment from 'moment';
import 'moment/locale/pl';
import 'moment/locale/en-gb';



class Coniunctum extends Component{
//
constructor(props){
    super(props);

    this.state = { 
        user: null,
        bigDate: null,
        navSectionData: {
            user: { userImg: '', nickname: ''},
            partner: { userImg: '', nickname: ''}
        },
        invitCode: '',
        currentComponent: 'chat'
    };

    this.setUser = this.setUser.bind(this);
    this.setBigDate = this.setBigDate.bind(this);
    this.setComponent = this.setComponent.bind(this);
}

    setBigDate(bigDate){
     this.setState({ bigDate: bigDate });
    }

    setComponent(e){
        this.setState({currentComponent: e.target.name});
    }

    componentWillMount(){
        this.setUser();
    }

    componentDidMount(){

        getSettings(this.state.user.relationshipId, this.state.user.userId)
        .then( res => {
            if (res !== undefined) {
                this.setState( prevState => { 
                    // set date lang
                    moment.locale(res.lang);
                    return {
                        user: {
                            lang: res.lang,
                            intercourseHistory: res.intercourseHistory,
                            menstrualCycle: res.menstrualCycle,
                            contraceptionCycle: res.contraceptionCycle,
                            ...prevState.user
                        }
                    }
                });
            }
        });

        getBigDate(this.state.user)
        .then(response => {
            if (response !== undefined) {
                this.setBigDate(response);
            }
        });

        getPartnersLabels(this.state.user)
        .then(response => {
            if(response){
                this.setState({navSectionData: response});
            }
        });

        getInvitCode(this.state.user.relationshipId)
        .then(response => {
            if(response)
                this.setState({ invitCode: response.invitCode });
        });
    }

    setUser() {
        const decoded = resolveUserToken(localStorage);
        if(decoded === false) {
            this.props.history.push('/login/pl');
        } else {
            const user = {
                relationshipId: decoded.relationshipId,
                userId: decoded.userId,
                email: decoded.email,
                nickname: decoded.nickname,
                sex: decoded.sex
            };

            this.setState({user});
        }
    }

//

    render () {
        const componentsNames = {
            'chat': CONIUNCTUM.COMPONENTS_NAME1[this.state.user.lang],
            'pairPartner': CONIUNCTUM.COMPONENTS_NAME2[this.state.user.lang],
            'anniversaries': CONIUNCTUM.COMPONENTS_NAME3[this.state.user.lang],
            'gift': CONIUNCTUM.COMPONENTS_NAME4[this.state.user.lang],
            'lifeInfo': CONIUNCTUM.COMPONENTS_NAME5[this.state.user.lang],
            'wardrobe': CONIUNCTUM.COMPONENTS_NAME6[this.state.user.lang],
            'favorites': CONIUNCTUM.COMPONENTS_NAME7[this.state.user.lang],
            'calendar': CONIUNCTUM.COMPONENTS_NAME8[this.state.user.lang],
            'settings': CONIUNCTUM.COMPONENTS_NAME9[this.state.user.lang]
        };


        return (
            <div className="container">
                <HeaderBar bigDate={this.state.bigDate} currentComponent={componentsNames[this.state.currentComponent]} user={this.state.user} />
                <main className="appMain">
                    <section className="mainContent">
                    { this.state.invitCode && 
                                        (<div className="invitationBar">
                                            <div className="invitContainer">
                                                <p>{CONIUNCTUM.P1[this.state.user.lang]}</p>
                                                <button name='pairPartner' onClick={this.setComponent} className='greenButton'>{CONIUNCTUM.BUTTON1[this.state.user.lang]}</button>
                                            </div>
                                        </div>)
                                    }
                    {/* Switch for the mainContent components */}
                        {{
                        'chat':<ChatSection 
                                    user={this.state.user} 
                                    userImg={this.state.navSectionData.user.userImg}
                                    partnerImg={this.state.navSectionData.partner? this.state.navSectionData.partner.userImg : ''}
                                />,
                        'pairPartner': this.state.invitCode && <PartnerInvitation lang={this.state.user.lang} invitCode={this.state.invitCode} relationshipId={this.state.user.relationshipId} setComponent={this.setComponent}/>,
                        'lifeInfo': <RelatinshipCards user={this.state.user} cardName='lifeInfo' />,
                        'wardrobe': <RelatinshipCards user={this.state.user} cardName='wardrobe' />,
                        'favorites': <RelatinshipCards user={this.state.user} cardName='favorites' />,
                        'gift': <RelatinshipCards user={this.state.user} cardName='gift' />,
                        'anniversaries': <AnniversariesCard user={this.state.user} />,
                        'calendar': <Calendar user={this.state.user} />,
                        'settings': <Settings user={this.state.user} />

                            
                        }[this.state.currentComponent]
                        }
                    </section>
                    <NavSection {...this.state.navSectionData} setComponent={this.setComponent} currentComponent={this.state.currentComponent} userObj={this.state.user}/>
                </main>
           </div>
        );
    }
}


export default Coniunctum;