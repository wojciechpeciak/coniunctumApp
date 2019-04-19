//based on https://www.codementor.io/reactjs/tutorial/building-a-calendar-using-react-js--less-css-and-font-awesome
import React from 'react';
import moment from 'moment';
import './CalendarSection.css';
import addButton from '../assets/plus-button.png';
import cancelButton from '../assets/delete-button.png';
import { createEvent, updateEvent, getDailyEvents, delteEvent, getMonthlyEvents } from './UserFunctions';
import menstruationIcon from '../assets/menstruation.png';
import menstruationPredictIcon from '../assets/menstruationPredict.png';
import ovulationIcon from '../assets/ovulation.png';
import pillsPredictIcon from '../assets/pillsPredict.png';
import pillsIcon from '../assets/pills2.png';
import sexIcon from '../assets/sex.png';
import protectedSexIcon from '../assets/protectedSex.png';
import calendarIcon from '../assets/schedule.png';
import noSex from '../assets/noBed.png';
import sex from '../assets/bed.png';
import unprotectedSex from '../assets/condomDown.png';
import protectedSex from '../assets/condomUp.png';
import { CALENDAR, REGISTER } from '../TextContent';
import 'moment/locale/pl';
import 'moment/locale/en-gb';



class Calendar extends React.Component {
    constructor(props) {
      super(props);
      moment.locale(this.props.user.lang);
      this.state = {
        month: moment().startOf('day'),
        selected: moment().startOf('day'),
        monthlyEvents: []
      };
      
      this.previous = this.previous.bind(this);
      this.next = this.next.bind(this);
      this.refreshMonthlyView = this.refreshMonthlyView.bind(this);
    }

    componentDidMount(){
        getMonthlyEvents(this.props.user.relationshipId, this.state.selected.toISOString())
        .then( monthArray => {
            if (monthArray !== undefined) {
                this.setState({
                    monthlyEvents: monthArray,
                })
            }
        });
    }
    

    refreshMonthlyView(){
        getMonthlyEvents(this.props.user.relationshipId, this.state.selected.toISOString())
        .then( monthArray => {
            if (monthArray !== undefined) {
                this.setState({
                    monthlyEvents: monthArray,
                })
            }
        });
    }
    
    previous() {
      const {
        month,
      } = this.state;
      month.subtract(1, 'month').startOf('day');
      getMonthlyEvents(this.props.user.relationshipId, month.toISOString())
        .then( monthArray => {
            if (monthArray !== undefined) {
                this.setState({
                    monthlyEvents: monthArray,
                    month: month
                })
            }
        });
    }
  
    next() {
      const {
        month,
      } = this.state;
      month.add(1,'month').startOf('day');

      getMonthlyEvents(this.props.user.relationshipId, month.toISOString())
        .then( monthArray => {
            if (monthArray !== undefined) {
                this.setState({
                    monthlyEvents: monthArray,
                    month: month
                })
            }
        });
    }
    
    select(day) {
        if(day.date.month() !== this.state.month.month()){
            getMonthlyEvents(this.props.user.relationshipId, day.date.toISOString())
            .then( monthArray => {
                if (monthArray !== undefined) {
                    this.setState({
                        monthlyEvents: monthArray,
                        selected: day.date,
                        month: day.date.clone(),
                    })
                }
            });
        }else{
            this.setState({
                selected: day.date,
                month: day.date.clone(),
            });
        }
    }
  
    renderWeeks() {
      let weeks = [];
      let done = false;
      let date = this.state.month.clone().startOf("month").add("w" -1).day(1);
      let count = 0;
      let monthIndex = date.month();
  
      const {
        selected,
        month,
      } = this.state;
  
      while (!done) {
        weeks.push(
          <Week key={date} 
            date={date.clone()} 
            month={month} 
            select={(day)=>this.select(day)} 
            selected={selected} 
            monthlyEvents={this.state.monthlyEvents}/>
        );
  
        date.add(1, "w");
        
        done = count++ > 2 && monthIndex !== date.month();
        monthIndex = date.month();
      }
  
      return weeks;
    };
  
    renderMonthLabel() {
      const {
        month,
      } = this.state;
      return <span className="month-label">{month.format("MMMM YYYY")}</span>;
    }
  
    render() {
      return (
        <React.Fragment>
            <section className="calendar">
                <header className="header">
                    <div className="month-display row">
                    <i className="arrow previous"  onClick={this.previous}>&#10140;</i>
                    {this.renderMonthLabel()}
                    <i className="arrow" onClick={this.next}>&#10140;</i>
                    </div>
                    <DayNames lang={this.props.user.lang}/>
                </header>
                {this.renderWeeks()}
            </section>{moment().h}
            <div className="legend">
                {this.props.user.intercourseHistory && <div className="legendItem"><img src={sexIcon} alt="Intercorse icon"/><p>{CALENDAR.BUTTON4[this.props.user.lang]}</p></div>}
                {this.props.user.menstrualCycle && <div className="legendItem"><img src={menstruationPredictIcon} alt="Menstruation icon"/><p>{CALENDAR.BUTTON2[this.props.user.lang]}</p></div>}
                {this.props.user.menstrualCycle && <div className="legendItem"><img src={ovulationIcon} alt="Fertile icon"/><p>{CALENDAR.P1_legend[this.props.user.lang]}</p></div>}
                {this.props.user.contraceptionCycle && <div className="legendItem"><img src={pillsPredictIcon} alt="Contraception icon"/><p>{CALENDAR.BUTTON3[this.props.user.lang]}</p></div>}
            </div>
            <DailyEvents user={this.props.user} pickedDate={this.state.selected} refreshMonthlyView={this.refreshMonthlyView}/>
        </React.Fragment>
      );
    }
  }
  
  class DayNames extends React.Component {
      render() {
          return (
            <div className="row day-names">
              <span className="day">{CALENDAR.SPAN1_mon[this.props.lang]}</span>
              <span className="day">{CALENDAR.SPAN2_tue[this.props.lang]}</span>
              <span className="day">{CALENDAR.SPAN3_wed[this.props.lang]}</span>
              <span className="day">{CALENDAR.SPAN4_thu[this.props.lang]}</span>
              <span className="day">{CALENDAR.SPAN5_fri[this.props.lang]}</span>
              <span className="day">{CALENDAR.SPAN6_sat[this.props.lang]}</span>
              <span className="day">{CALENDAR.SPAN7_sun[this.props.lang]}</span>
            </div>
          );
      }
  }
  
  class Week extends React.Component {
    render() {
      let days = [];
      let {
        date,
      } = this.props;
      
      const {
        month,
        selected,
        select,
      } = this.props;
  
      for (var i = 0; i < 7; i++) {
        let day = {
            name: date.format("dd").substring(0, 1),
            number: date.date(),
            isCurrentMonth: date.month() === month.month(),
            isToday: date.isSame(new Date(), "day"),
            date: date
        };
        days.push(
          <Day day={day}
            selected={selected}
            select={select}
            key={i}
            //pass down dailyEvents only if it is in currently displayed month
            dailyEvents={day.isCurrentMonth? this.props.monthlyEvents[day.number - 1] : undefined }/>
        );
  
        date = date.clone();
        date.add(1, "day");
      }
  
      return (
        <div className="row week" key={days[0]}>
          {days}
        </div>
      );
    }
  
  }
  
  class Day extends React.Component {
    render() {
      const {
        day,
        day: {
          date,
          isCurrentMonth,
          isToday,
          number
        },
        select,
        selected
      } = this.props;
  
      return (
        <span 
          key={date.toString()} 
          className={"day" + (isToday ? " today" : "") + (isCurrentMonth ? "" : " different-month") + (date.isSame(selected) ? " selected" : "")} 
          onClick={()=>select(day)}>
          {number}
          { this.props.dailyEvents !== undefined && this.props.dailyEvents.event === true && <div className="labelContainer"></div>}
          { this.props.dailyEvents !== undefined && {
              'Predicted': <img src={menstruationPredictIcon} alt="Predicted period icon" className="iconLabel topLeft"/>,
              'Menstruation': <img src={menstruationIcon} alt="On period icon" className="iconLabel topLeft"/>,
              'Ovulation': <img src={ovulationIcon} alt="On ovulation icon" className="iconLabel topLeft"/>
          }[this.props.dailyEvents.menstruation]}
          { this.props.dailyEvents !== undefined && {
              'Predicted': <img src={pillsPredictIcon} alt="Predicted pill icon" className="iconLabel topRight"/>,
              'Contraception': <img src={pillsIcon} alt="On pill icon" className="iconLabel topRight"/>
          }[this.props.dailyEvents.contraception]}
          { this.props.dailyEvents !== undefined && {
              'Sex': <img src={sexIcon} alt="Love icon" className="iconLabel bottomLeft"/>,
              'ProtectedSex': <img src={protectedSexIcon} alt="Protected love icon" className="iconLabel bottomLeft"/>
          }[this.props.dailyEvents.sex]}
          
          </span>
      );
    }
  }

  class DailyEvents extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            eventToEdit: null,
            dailyEvents: [],
            actionType: ''
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.switchActionType = this.switchActionType.bind(this);
    }
    componentDidMount(){
        getDailyEvents(this.props.user.relationshipId, this.props.pickedDate.toISOString() )
        .then( eventsArray => {
            if (eventsArray) {
                this.setState( { dailyEvents: this.mapDailyEventsbyUser(eventsArray) } );
            }
        })
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.pickedDate !== this.props.pickedDate) {
            getDailyEvents(this.props.user.relationshipId, nextProps.pickedDate.toISOString())
            .then( eventsArray => {
                if (eventsArray) {
                    this.setState( { dailyEvents: this.mapDailyEventsbyUser(eventsArray) } );
                }
            })
        }
    }
    switchActionType(actionName){
        this.setState( { actionType: actionName} );
    }
    onSubmit(event){
        // submit new or changed event
        if (event._id === undefined) {
            createEvent(this.props.user.relationshipId, event, this.props.pickedDate.toISOString() )
            .then( res => {
                if (res) {
                    this.setState( { dailyEvents: this.mapDailyEventsbyUser(res), actionType: '' } );
                    this.props.refreshMonthlyView();
                }   
            });
        } else {
            updateEvent(this.props.user.relationshipId, event, this.props.pickedDate.toISOString())
            .then( res => {
                if (res) {
                    this.setState( { dailyEvents: this.mapDailyEventsbyUser(res), actionType: '' } );
                    this.props.refreshMonthlyView();
                }   
            });
        }
    }
    onDelete(eventId){
        delteEvent(this.props.user.relationshipId, eventId, this.props.pickedDate.toISOString() )
        .then( res => {
            if (res) {
                this.setState( { dailyEvents: this.mapDailyEventsbyUser(res), actionType: '' } );
                this.props.refreshMonthlyView();

            }   
        });
    }
    mapDailyEventsbyUser(eventsArray){
        const mapedDailyEvents = eventsArray.map( elem => {
            // map labels
            if(elem.eventType === 'Me' && elem.createdByUser !== this.props.user.userId)
                elem.eventType = 'Partner';
            else if(elem.eventType === 'Partner' && elem.createdByUser !== this.props.user.userId)
                elem.eventType = 'Me';
            // map dates strings to moment
            elem.startDate = moment(elem.startDate);
            elem.endDate = moment(elem.endDate);
            return elem;
        })
        return mapedDailyEvents;
    }
    render(){
        const {lang} = this.props.user;
        const defaultEvent = {
            createdByUser: this.props.user.userId,
            title: '',
            description: '',
            eventType: 'Both',
                //enum: ['Me', 'Both', 'Partner', 'Menstruation', 'Contraception', 'Sex', 'ProtectedSex']
            startDate: this.props.pickedDate,
            endDate: this.props.pickedDate
        }
        
        const eventsTypesPicker = (
            <div className="eventsTypesPicker">
                <button className="eventType" onClick={() => this.switchActionType('AddEvent')}>
                    <img src={calendarIcon} alt="calendar icon"/>
                    {CALENDAR.BUTTON1[lang]}</button>
                {/*this.props.user.sex === 'female' &&*/ this.props.user.menstrualCycle && <button className="eventType" onClick={() => this.switchActionType('EditMenstruation')}>
                    <img src={menstruationIcon} alt="menstruation icon"/>
                    {CALENDAR.BUTTON2[lang]}</button>}
                {/*this.props.user.sex === 'female' &&*/ this.props.user.contraceptionCycle && <button className="eventType" onClick={() => this.switchActionType('EditContraception')}>
                    <img src={pillsIcon} alt="contraception icon"/>
                    {CALENDAR.BUTTON3[lang]}</button>}
                {this.props.user.intercourseHistory && <button className="eventType" onClick={() => this.switchActionType('EditIntercourse')}>
                    <img src={protectedSexIcon} alt="intercourse icon"/> 
                    {CALENDAR.BUTTON4[lang]}</button>}
                <input type="image" src={cancelButton} alt="cancelation button" onClick={() => this.switchActionType('')}/>
            </div>
        );

        const eventsList = this.state.dailyEvents.map( (event, key) => {
            if (event.eventType === 'Me' || event.eventType === 'Both' || event.eventType === 'Partner') {
                return (
                    <button className="eventsListItem" key={'event'+key} onClick={() => this.setState( { eventToEdit: key, actionType: 'ViewEvent' } ) }>
                        <div className="eventItemLabel">
                            {{
                                'Both': <p className="calendarEventLabel bothEventLabel">{CALENDAR.LABEL_short_both[lang]}</p>,
                                'Me': <p className="calendarEventLabel meEventLabel">{CALENDAR.LABEL_short_me[lang]}</p>,
                                'Partner': <p className="calendarEventLabel partnerEventLabel">{CALENDAR.LABEL_short_partner[lang]}</p>
                            }[event.eventType]}
                            <p className="itemStartDate">{moment(event.startDate).format('D MMM')}</p>
                        </div>
                        <p className="eventTitle">{event.title}</p>
                    </button>
                );
            } else
                return null;
        });
        return (
            <section className="dailyEvents">
                <input type="image" src={addButton} alt="add event button" onClick={() => this.switchActionType('eventsTypesPicker')}/>
                <div className="dailyEventsTitle">
                    <p>&#9998; {CALENDAR.P1[lang]}</p>
                    <p>{this.props.pickedDate.format('DD-MM-YYYY')}</p>
                </div>
                <div className="eventsList">
                    {eventsList}
                </div>
                {{
                    'eventsTypesPicker': <div className="fullView"> {eventsTypesPicker} </div>,
                    'AddEvent': <div className="fullView"><EditEvent 
                        lang={lang}
                        onSubmit={this.onSubmit} 
                        event={defaultEvent} 
                        switchActionType={this.switchActionType}/> </div>,
                    'EditMenstruation': <div className="fullView"><EditMenstruationOrContraception  
                        lang={lang}
                        onSubmit={this.onSubmit} 
                        onDelete={this.onDelete} 
                        event={this.state.dailyEvents.find( elem => elem.eventType === 'Menstruation') || defaultEvent} 
                        switchActionType={this.switchActionType}
                        type={'Menstruation'}/> </div>,
                    'EditContraception': <div className="fullView"><EditMenstruationOrContraception  
                        lang={lang}
                        onSubmit={this.onSubmit} 
                        onDelete={this.onDelete} 
                        event={this.state.dailyEvents.find( elem => elem.eventType === 'Contraception') || defaultEvent} 
                        switchActionType={this.switchActionType} 
                        type={'Contraception'}/> </div>,
                    'EditIntercourse': <div className="fullView"><EditIntercourse  
                        lang={lang}
                        onSubmit={this.onSubmit} 
                        onDelete={this.onDelete} 
                        event={this.state.dailyEvents.find( elem => ( elem.eventType === 'Sex' || elem.eventType === 'ProtectedSex' ) ) || defaultEvent} 
                        switchActionType={this.switchActionType} /> </div>,
                    'EditEvent': <div className="fullView"><EditEvent  
                        lang={lang}
                        onSubmit={this.onSubmit} 
                        onDelete={this.onDelete} 
                        event={this.state.dailyEvents[this.state.eventToEdit]} 
                        switchActionType={this.switchActionType}/> </div>,
                    'ViewEvent': <div className="fullView"><ViewEvent  
                        lang={lang}
                        onDelete={this.onDelete} 
                        event={this.state.dailyEvents[this.state.eventToEdit]} 
                        switchActionType={this.switchActionType}/> </div>
                }[this.state.actionType]
                }
            </section>
        );
    }
  }

  function ViewEvent(props){
    const calendarEventLabel = {
        'Both': <p className="calendarEventLabel bothEventLabel">{CALENDAR.LABEL_short_both[props.lang]}</p>,
        'Me': <p className="calendarEventLabel meEventLabel">{CALENDAR.LABEL_short_me[props.lang]}</p>,
        'Partner': <p className="calendarEventLabel partnerEventLabel">{CALENDAR.LABEL_short_partner[props.lang]}</p>
    }[props.event.eventType]

    return (
        <div className="eventView">
            <div className="eventViewTitleLabel">
                {calendarEventLabel}
                <h1 className="eventTitle">{props.event.title}</h1>
            </div>
            <div className="eventViewDates">
                <div className="eventViewDate">
                    <p>{CALENDAR.P2[props.lang]}</p>
                    <p className="date">{props.event.startDate.format('ddd, DD.MM.YYYY, HH:mm')}</p>
                </div>
                <div className="eventViewDate">
                    <p>{CALENDAR.P3[props.lang]}</p>
                    <p className="date">{props.event.endDate.format('ddd, DD.MM.YYYY, HH:mm')}</p>
                </div>
            </div>
            <div className="eventViewDescription">
                <p>{props.event.description}</p>
            </div>
            <div className="eventViewActionBar">
                <button onClick={() => props.switchActionType('') }>{CALENDAR.BUTTON5[props.lang]}</button>
                {(props.event._id !== undefined) && (<button onClick={() => props.onDelete(props.event._id) } className="delete">{CALENDAR.BUTTON6[props.lang]}</button>)}
                <button onClick={() => props.switchActionType('EditEvent') } className="edit">{CALENDAR.BUTTON7[props.lang]}</button>
            </div>
        </div>

    );
  }

  class EditEvent extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            newEvent: this.props.event._id === undefined,
            eventStartDate: this.props.event.startDate.format('YYYY-MM-DD'),
            eventStartTime: this.props.event.startDate.format('HH:mm'),
            eventEndDate: this.props.event.endDate.format('YYYY-MM-DD'),
            eventEndTime: this.props.event.endDate.format('HH:mm'),
            ...this.props.event
        }

        this.onChange = this.onChange.bind(this);
        this.beforeSubmit = this.beforeSubmit.bind(this);
        this.validateDates = this.validateDates.bind(this);
    }
    componentDidUpdate(){
        this.validateDates();
    }
    onChange(e){
        this.setState( { [e.target.name] : e.target.value} );
    }

    validateDates() { 
        const startDate = moment(this.state.eventStartDate + ' ' + this.state.eventStartTime);
        const endDate = moment(this.state.eventEndDate + ' ' + this.state.eventEndTime); 

        if (startDate > endDate) {
            document.getElementById('eventEndDate').setCustomValidity(CALENDAR.VALIDATION1[this.props.lang]);            
        } else {
            document.getElementById('eventEndDate').setCustomValidity('');                        
        }
    };

    onClickSetCalendarEventType(type){
        this.setState( { eventType: type } );
    }

    // Before submit prepare date and time input
    beforeSubmit(e){
        e.preventDefault();
        //prepare start and end dates for DB
        const startDate = moment(this.state.eventStartDate + ' ' + this.state.eventStartTime).toISOString();
        const endDate = moment(this.state.eventEndDate + ' ' + this.state.eventEndTime).toISOString();
        // prepare edited event
        const editedEvent = {
            _id: this.props.event._id,
            createdByUser: this.state.createdByUser,
            title: this.state.title,
            description: this.state.description,
            eventType: this.state.eventType,
            startDate: startDate,
            endDate: endDate
        }
        this.props.onSubmit(editedEvent);
    }
    // if eventId exist update it, otherwise create new

    render(){
        const {lang} = this.props;
        const calendarEventLabel = {
            'Both': <p className="calendarEventLabel bothEventLabel">{CALENDAR.LABEL_short_both[lang]}</p>,
            'Me': <p className="calendarEventLabel meEventLabel">{CALENDAR.LABEL_short_me[lang]}</p>,
            'Partner': <p className="calendarEventLabel partnerEventLabel">{CALENDAR.LABEL_short_partner[lang]}</p>
        }[this.state.eventType]

        return (
            <form className="eventEdit" onSubmit={this.beforeSubmit}>
                <h1 className="cardTitle">{CALENDAR.H11[lang]}</h1>
                <div className="calendarEventTypes">
                    {calendarEventLabel}
                    <button className="calendarEventType bothEventLabel" onClick={(e) => {e.preventDefault(); this.onClickSetCalendarEventType('Both');} }>{CALENDAR.LABEL_long_both[lang]}</button>
                    <button className="calendarEventType meEventLabel" onClick={(e) => {e.preventDefault(); this.onClickSetCalendarEventType('Me');} }>{CALENDAR.LABEL_long_me[lang]}</button>
                    <button className="calendarEventType partnerEventLabel" onClick={(e) => {e.preventDefault(); this.onClickSetCalendarEventType('Partner');} }>{CALENDAR.LABEL_long_partner[lang]}</button>
                </div>
                <div className="eventTitle">
                        <label htmlFor="eventTitle">{REGISTER.step3_LABEL1[lang]}</label>
                        <input required type="text" name="title" id="eventTitle" value={this.state.title} onChange={this.onChange}/>
                </div>
                <div className="eventDates">
                    <div className="eventDate">
                        <label htmlFor="eventStartDate">{CALENDAR.P2[lang]}</label>
                        <input required type="date" name="eventStartDate" id="eventStartDate"  value={this.state.eventStartDate} onChange={this.onChange}/>
                        <input required type="time" name="eventStartTime" id="eventStartTime"  value={this.state.eventStartTime} onChange={this.onChange}/>
                    </div>
                    <div className="eventDate">
                        <label htmlFor="eventEndDate">{CALENDAR.P3[lang]}</label>
                        <input required type="date" name="eventEndDate" id="eventEndDate" value={this.state.eventEndDate} onChange={this.onChange}/>
                        <input required type="time" name="eventEndTime" id="eventEndTime" value={this.state.eventEndTime} onChange={this.onChange}/>
                    </div>
                </div>
                <div className="eventDescription">
                    <label htmlFor="eventDescription">{CALENDAR.LABEL1[lang]}</label>
                    <textarea name="description" id="eventDescription" cols="30" rows="10"  value={this.state.description} onChange={this.onChange}>
                    </textarea>
                </div>
                <div className="eventActionBar">
                    <button onClick={(e) => { e.preventDefault(); this.props.switchActionType(''); } }>{CALENDAR.BUTTON8[lang]}</button>
                    <button type="submit">{REGISTER.BUTTON3_submit[lang]}</button>
                </div>
            </form>

        );
    }
  }

  class EditMenstruationOrContraception extends React.Component {
      
    constructor(props){
        super(props);

        this.state = {
            newEvent: this.props.event._id === undefined,
            eventStartDate: this.props.event.startDate.format('ddd, DD.MM.YYYY'),
            ...this.props.event
        };

        this.chooseAction = this.chooseAction.bind(this);
        this.renderContraceptionEvent = this.renderContraceptionEvent.bind(this);
        this.renderMenstruationEvent = this.renderMenstruationEvent.bind(this);
    }


    // Before submit prepare date and time input
    chooseAction(e){
        e.preventDefault();
        // create new
        if (this.state.newEvent && 
        (this.state.eventType === 'Menstruation' || this.state.eventType === 'Contraception') 
        ) {
            // prepare edited event
            const editedEvent = {
                createdByUser: this.state.createdByUser,
                title: this.state.title,
                description: this.state.description,
                eventType: this.state.eventType,
                startDate: this.state.startDate,
                endDate: this.state.endDate
            }
            this.props.onSubmit(editedEvent); 
        } 
        // update existing one
        else if(!this.state.newEvent && 
            (this.state.eventType !== 'Menstruation' && this.state.eventType !== 'Contraception') ) {

            this.props.onDelete(this.props.event._id);
        }
        this.props.switchActionType('');
    }
    // if eventId exist update it, otherwise create new

    renderMenstruationEvent(){
        return (
            <form className="eventEdit smallCard" onSubmit={this.chooseAction}>
                <h1 className="cardTitle">{CALENDAR.H12[this.props.lang]}</h1>
                <div className="eventDates">
                    <div className="eventDate">
                        <p>{this.state.eventStartDate}</p>
                    </div>
                </div>
                    {this.state.eventType === 'Menstruation'? 
                        <button className="period" onClick={(e) => { e.preventDefault(); this.setState( { eventType: '' } ) }} >{CALENDAR.BUTTON9[this.props.lang]}</button> :
                        <button className="notPeriod" onClick={(e) => { e.preventDefault(); this.setState( { eventType: 'Menstruation' } ) }} >{CALENDAR.BUTTON10[this.props.lang]}</button>
                    }
                <div className="eventActionBar">
                    <button onClick={(e) => { e.preventDefault(); this.props.switchActionType(''); } }>{CALENDAR.BUTTON8[this.props.lang]}</button>
                    <button type="submit">{REGISTER.BUTTON3_submit[this.props.lang]}</button>
                </div>
            </form>

        );
    
    }
    renderContraceptionEvent(){
        return (
            <form className="eventEdit smallCard" onSubmit={this.chooseAction}>
                <h1 className="cardTitle">{CALENDAR.H13[this.props.lang]}</h1>
                <div className="eventDates">
                    <div className="eventDate">
                        <p>{this.state.eventStartDate}</p>
                    </div>
                </div>
                    {this.state.eventType === 'Contraception'? 
                        <button className="pill" onClick={(e) => { e.preventDefault(); this.setState( { eventType: '' } ) }} >{CALENDAR.BUTTON11[this.props.lang]}</button> :
                        <button className="noPill" onClick={(e) => { e.preventDefault(); this.setState( { eventType: 'Contraception' } ) }} >{CALENDAR.BUTTON12[this.props.lang]}</button>
                    }
                <div className="eventActionBar">
                    <button onClick={(e) => { e.preventDefault(); this.props.switchActionType(''); } }>{CALENDAR.BUTTON8[this.props.lang]}</button>
                    <button type="submit">{REGISTER.BUTTON3_submit[this.props.lang]}</button>
                </div>
            </form>

        );
    }

    render(){
       return this.props.type === 'Menstruation'? this.renderMenstruationEvent() : this.renderContraceptionEvent();        
    }
  }


  class EditIntercourse extends React.Component{
        
    constructor(props){
        super(props);

        this.state = {
            newEvent: this.props.event._id === undefined,
            eventStartDate: this.props.event.startDate.format('ddd, DD.MM.YYYY'),
            ...this.props.event
        };

        this.chooseAction = this.chooseAction.bind(this);
        this.renderEventButtons = this.renderEventButtons.bind(this);
    }


    // Before submit prepare date and time input
    chooseAction(e){
        e.preventDefault();
        // prepare event
        // prepare edited event
        const editedEvent = {
            _id: this.props.event._id,
            createdByUser: this.state.createdByUser,
            title: this.state.title,
            description: this.state.description,
            eventType: this.state.eventType,
            startDate: this.state.startDate,
            endDate: this.state.endDate
        }
        // create new
        if ( //check for proper event type 
            (this.state.eventType === 'Sex' || this.state.eventType === 'ProtectedSex')
            // check if there is a change to be submitted
            && this.state.eventType !== this.props.event.eventType ) {

            this.props.onSubmit(editedEvent); 
        } 
        else if(!this.state.newEvent && this.state.eventType === ''
            ) {

            this.props.onDelete(this.props.event._id);
        }
        this.props.switchActionType('');
    }

    renderEventButtons(eventType){
       switch (eventType) {
           case 'Sex':
               return <React.Fragment>
                            <button className="sex" onClick={(e) => { e.preventDefault(); this.setState( { eventType: '' } ) }} ><img src={sex} alt="Intercourse icon"/></button>
                            <button className="unprotectedSex" onClick={(e) => { e.preventDefault(); this.setState( { eventType: 'ProtectedSex' } ) }} ><img src={unprotectedSex} alt="Unprotected intercourse icon"/></button>
                    </React.Fragment>;
            case 'ProtectedSex':
                return <React.Fragment>
                        <button className="sex" onClick={(e) => { e.preventDefault(); this.setState( { eventType: '' } ) }} ><img src={sex} alt="Intercourse icon"/></button>
                        <button className="protectedSex" onClick={(e) => { e.preventDefault(); this.setState( { eventType: 'Sex' } ) }} ><img src={protectedSex} alt="Intercourse icon"/></button>
                    </React.Fragment>;
           default:
               return <React.Fragment>
                        <button className="noSex" onClick={(e) => { e.preventDefault(); this.setState( { eventType: 'Sex' } ) }} ><img src={noSex} alt="Intercourse icon"/></button>
                </React.Fragment>;
       }
    }
    // if eventId exist update it, otherwise create new

    render(){
        return (
            <form className="eventEdit smallCard" onSubmit={this.chooseAction}>
                <h1 className="cardTitle">{CALENDAR.H14[this.props.lang]}</h1>
                <div className="eventDates">
                    <div className="eventDate">
                        <p>{this.state.eventStartDate}</p>
                    </div>
                </div>
                <div className="eventOption">
                    {this.renderEventButtons(this.state.eventType)}
                </div>
                <div className="eventActionBar">
                    <button onClick={(e) => { e.preventDefault(); this.props.switchActionType(''); } }>{CALENDAR.BUTTON8[this.props.lang]}</button>
                    <button type="submit">{REGISTER.BUTTON3_submit[this.props.lang]}</button>
                </div>
            </form>

        );      
    }
  }
  
  export default Calendar;