import React, {Component, Fragment} from 'react';
import { register, checkEmail } from './UserFunctions';
import Navbar from './Navbar';
import Footer from './Footer';
import './Register.css';
import deleteButton from '../assets/delete-button.png';
import addButton from '../assets/plus-button.png';
import { REGISTER } from '../TextContent';

class Register extends Component {
    constructor(props){
        super(props);
        this.state={
            nickname: '',
            email: '',
            password: '',
            userImg: 'data:image/png;base64,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',
            sex: 'female',
            birthday: '',
            anniversaries: [
                {
                    title: REGISTER.step3_item[this.props.match.params.lang],
                    date: ''
                }
            ],
            favorites: [
                {
                    title: REGISTER.step4_item1[this.props.match.params.lang],
                    content: ''
                },
                {
                    title: REGISTER.step4_item2[this.props.match.params.lang],
                    content: ''
                }
            ],
            wardrobe: [
                {
                    title: REGISTER.step5_item1[this.props.match.params.lang],
                    content: ''
                },
                {
                    title: REGISTER.step5_item2[this.props.match.params.lang],
                    content: ''
                },
                {
                    title: REGISTER.step5_item3[this.props.match.params.lang],
                    content: ''
                }
            ],
            lifeInfo: [
                {
                    title: REGISTER.step6_item1[this.props.match.params.lang],
                    content: ''
                },
                {
                    title: REGISTER.step6_item2[this.props.match.params.lang],
                    content: ''
                },
                {
                    title: REGISTER.step6_item3[this.props.match.params.lang],
                    content: ''
                },
            ],
            /************/
            passwordRepeat: '',
            errors: {},
            currentStep: 1,
            lang: this.props.match.params.lang
        };

        this.onToggle = this.onToggle.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this._next = this._next.bind(this);
        this._prev = this._prev.bind(this);
        this.validate = this.validate.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
        this.onChangeArray = this.onChangeArray.bind(this);
        this.onDeleteArray = this.onDeleteArray.bind(this);
        this.onAddArray = this.onAddArray.bind(this);

    }

    componentWillReceiveProps(nextProps){
        if (nextProps.match.params.lang !== this.props.match.params.lang) {
            this.setState( { lang: nextProps.match.params.lang } );
        }
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onFileUpload(fileReaderResult){
        this.setState({ userImg: fileReaderResult});
    }

    onChangeArray(index, arrayName, fieldName, newValue){
        this.setState(prevState => {
            const copyArray = [...prevState[arrayName]];
            copyArray[index][fieldName] = newValue;
            return {[arrayName]: copyArray};
        });
    
    }
    onDeleteArray(index, arrayName){
        this.setState(prevState => {
            const copyArray = [...prevState[arrayName]];
            copyArray.splice(index, 1);
            return {[arrayName]: copyArray};
        });
    
    }
    onAddArray(arrayName, defaultObj){
        this.setState(prevState => {
            const copyArray = [...prevState[arrayName]];
            copyArray.push( defaultObj );
            return {[arrayName]: copyArray};
        });
    }

    onToggle(e) {
        this.setState(prevState => ({ [e.target.name]: !prevState[e.target.name] }));
    }

    onSubmit(e) {
        e.preventDefault();

        const newUser = { ...this.state };
        delete newUser.currentStep;
        delete newUser.errors;
        delete newUser.passwordRepeat;
        // map strings to ISO dates
        newUser.anniversaries = this.state.anniversaries.map( elem => {
            elem.date = new Date(elem.date)
            return elem;
        });

        newUser.birthday = new Date(this.state.birthday);


        register(newUser).then(res => {
            this.props.history.push(this.props.match.params.lang === 'en'? '/login/en' : '/login/pl');
        });

    }

    _next(){
        this.setState(prevState => 
            ({currentStep: prevState.currentStep >= 5? 6 : prevState.currentStep+1 })
        );
    }

    _prev(){
        this.setState(prevState =>
            ({currentStep: prevState.currentStep <= 1? 1 : prevState.currentStep-1})
        );
    }

    get previousButton(){
        if (this.state.currentStep !== 1) {
            return (
                <button className="formButton" type="button" onClick={this._prev}>
                    {REGISTER.BUTTON1_prev[this.props.match.params.lang]}
                </button>
            );
        }
        return null;
    }

    get nextButton(){
        if (this.state.currentStep < 6) {
            return (
                <button className="formButton" type="button" onClick={ () => { if(this.validate()) this._next();}}>
                    {REGISTER.BUTTON2_next[this.props.match.params.lang]}
                </button>
            );
        }
        return null;
    }

    get submitButton(){
        if (this.state.currentStep === 6){
            return (
                <button className="formButton" type="submit" onSubmit={this.onSubmit}>{REGISTER.BUTTON3_submit[this.props.match.params.lang]}</button>
            );
        }
        return null;
    }

    validate(){
        const inptArray = document.getElementsByTagName("form");
        return inptArray[0].reportValidity();
    };

    render() {
        const {lang} = this.props.match.params;
        return (
            <div className="registerPage">
                <Navbar register={true}/>
                <progress value={this.state.currentStep} max="6"></progress>
                <div className="progressSteps"> {REGISTER.DIV1_1_step[lang]} {this.state.currentStep} {REGISTER.DIV1_2_step[lang]} 6</div>
                <main className="registrationForm" id="mainId">
                    <form onSubmit={this.onSubmit} id='fileFormStep'>
                        <Step1
                            {...this.state}
                            onChange={this.onChange}
                        />
                        <Step2
                            {...this.state}
                            onChange={this.onChange}
                            //onToggle={this.onToggle}
                            onFileUpload={this.onFileUpload}
                        />
                        <Step3 
                            {...this.state}
                            onChangeArray={this.onChangeArray}
                            onDeleteArray={this.onDeleteArray}
                            onAddArray={this.onAddArray}
                        />
                        <Step4
                            {...this.state}
                            onChangeArray={this.onChangeArray}
                            onDeleteArray={this.onDeleteArray}
                            onAddArray={this.onAddArray}
                        />
                        <Step5
                            {...this.state}
                            onChangeArray={this.onChangeArray}
                            onDeleteArray={this.onDeleteArray}
                            onAddArray={this.onAddArray}
                        />
                        <Step6
                            {...this.state}
                            onChangeArray={this.onChangeArray}
                            onDeleteArray={this.onDeleteArray}
                            onAddArray={this.onAddArray}
                        />
                    <div className="formNav">
                        {this.previousButton}
                        {this.nextButton}
                        {this.submitButton}
                    </div>
                    </form> 
                    
                </main>
                <Footer />
            </div>
        );
    }
}

function Step1(props){
    if (props.currentStep !== 1) {
        return null;
    }
    // Set custom validation on password confirmation
    const validatePassword = () => { 
        const password = document.getElementById("password"), confirmPassword = document.getElementById("passwordRepeat");

        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity(REGISTER.step1_VALIDATION_pass[props.lang]);
        } else {
            confirmPassword.setCustomValidity('');
        }
    };

    const validateEmail = (e) => {
        const email = e.target.value;

        checkEmail(email)
        .then(resData => {
            if (resData.email === email && resData.valid === false) {
                document.getElementById('email').setCustomValidity(REGISTER.step1_VALIDATION_email[props.lang]);
            } else {
                document.getElementById('email').setCustomValidity('');
            }
        })
        .catch(err => {
            console.log('validateEmail function error: ', err);
        });
    };

    return (
        <Fragment>
            <section 
                className="formStep"
            >
                <h1 className="title">{REGISTER.step1_H11[props.lang]}</h1>
                <p>{REGISTER.step1_P1[props.lang]}</p>
                <div className="inputSection">
                    <label htmlFor="email">{REGISTER.step1_LABEL1[props.lang]}</label>
                    <input type="email" name="email" id="email" required value={props.email} onChange={(e) => {props.onChange(e); validateEmail(e);}} /*onBlur={validateEmail}*//>
                    
                
                <label htmlFor="password">{REGISTER.step1_LABEL2[props.lang]}</label>
                <input type="password" name="password" id="password" minLength="8" required value={props.password} onChange={ (e) => {props.onChange(e); validatePassword();}}/>
                <label htmlFor="passwordRepeat">{REGISTER.step1_LABEL3[props.lang]}</label>
                <input type="password" name="passwordRepeat" id="passwordRepeat" minLength="8" required value={props.passwordRepeat} onChange={ (e) => { props.onChange(e); validatePassword(); } }/>
                </div>
            </section>
        </Fragment>
    );

}

class Step2 extends Component{
    constructor(props){
        super(props);

        this.state = {
            fotoTag: <div id='userImgView'><p>{REGISTER.step2_P1[this.props.lang]}</p><img src={this.props.userImg} alt=""/></div>,
            fileName: null
        };

        this.validFileType = this.validFileType.bind(this);
        this.validateFoto = this.validateFoto.bind(this);
    }

    // Validate file type
     validFileType(file){
        const fileTypes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png'
        ];

        for (let index = 0; index < fileTypes.length; index++) {
            if (fileTypes[index] === file.type)
                return true;            
        }
        return false;
    }

    // process profile foto
     validateFoto(e) {
        document.getElementById('userImg').setCustomValidity('');
        if (e.target.files.length === 0) {
                //this.setState({fotoTag: <p id='userImgView'>No file selected for upload</p>});
        } else if ( this.validFileType(e.target.files[0]) ) {
            let file = e.target.files[0];
            let reader = new FileReader();
            // resize foto
            let img = document.createElement("img");

            reader.onload = (e) => {img.src = e.target.result};
            // main resize logic
            reader.onloadend = (e) => {
                let canvas=document.createElement("canvas");
                let context=canvas.getContext("2d");
                context.drawImage(img, 0, 0);

                const MAX_WIDTH = 200;
                const MAX_HEIGHT = 200;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                context = canvas.getContext("2d");
                context.drawImage(img, 0, 0, width, height);

                const temp = canvas.toDataURL('image/jpeg', 0.9);
                this.props.onFileUpload(temp);
                this.setState({ fileName: file.name });
            }
            reader.readAsDataURL(e.target.files[0]);
        } else {
            //this.setState({fotoTag: <p id='userImgView'>File name {e.target.files[0].name}: Not valid file type.</p>});
            document.getElementById('userImg').setCustomValidity('"' + e.target.files[0].name + REGISTER.step2_VALIDATION1[this.props.lang])
        }
    }

    render(){
        if (this.props.currentStep !== 2) {
            return null;
        }
    
        return (
            <Fragment>
                <section 
                    className="formStep"
                    id="fileFormStep"
                >
                    <h1 className="title">{REGISTER.step2_H11[this.props.lang]}</h1>
                    <p>{REGISTER.step2_P3[this.props.lang]}</p>
                    {/* foto upload */}
                    <div className="fileSection">
                        <div id='userImgView'><p>{this.state.fileName ? (REGISTER.step2_P2[this.props.lang] + this.state.fileName) : REGISTER.step2_P1[this.props.lang]}</p><img src={this.props.userImg} alt=""/></div>
                        <button type="button">
                            <label htmlFor="userImg" id='userImgLabel'>{REGISTER.step2_LABEL1[this.props.lang]}</label>
                            <input type="file" name="userImg" id="userImg" accept=".jpg, .jpeg, .png" onChange={this.validateFoto}/>    
                        </button>
                    </div>
                    {/* resto of formStep */}
                    <div className="inputSection">
                        <label htmlFor="nickname">{REGISTER.step2_LABEL2[this.props.lang]}</label>
                        <input type="text" name="nickname" id="nickname" required value={this.props.nickname} onChange={this.props.onChange}/>
                        <div>                        
                            <fieldset>
                                <legend>{REGISTER.step2_LEGEND1[this.props.lang]}</legend>
                                <label htmlFor="female" className={this.props.sex === 'female'? 'checked' : ''}>{REGISTER.step2_LABEL3[this.props.lang]}</label>
                                <input type="radio" name="sex" id="female" required value="female" 
                                    checked={this.props.sex === 'female'} onChange={ this.props.onChange}/>
                                <label htmlFor="male" className={this.props.sex === 'male'? 'checked' : ''}>{REGISTER.step2_LABEL4[this.props.lang]}</label>
                                <input type="radio" name="sex" id="male" required value="male"
                                    checked={this.props.sex === 'male'} onChange={ this.props.onChange}/>
                            </fieldset>
                            <div className="birthday">
                                <label htmlFor="birthday">{REGISTER.step2_LABEL5[this.props.lang]}</label>
                                <input type="date" name="birthday" id="birthday" value={this.props.birthday}
                                    onChange={this.props.onChange} />
                            </div>
                        </div>
                    </div>
                </section>
            </Fragment>
        );
    }
}

function Step3(props){
    if (props.currentStep !== 3) {
        return null;
    }
    
    const arrayName = 'anniversaries';
    const defaultObj = { title: '', date: ''};

    return (
        <Fragment>
            <section 
                className="formStep"
            >
                <h1 className="title">{REGISTER.step3_H11[props.lang]}</h1>
                <p>{REGISTER.step3_P1_1[props.lang]}<br/>
                {REGISTER.step3_P1_2[props.lang]}</p>
                {props.anniversaries.map( (elem, key) => {
                    return (
                        <div className="listItem" key={key}>
                            <div className="inputItemSection">
                                <div className="inputItem">
                                    <label htmlFor={'title'+key}>{REGISTER.step3_LABEL1[props.lang]}</label>
                                    <input type="text" name="title" id={'title'+key} required value={elem.title} onChange={(e) => props.onChangeArray(key, arrayName, 'title', e.target.value)} />
                                </div>
                                <div className="inputItem">
                                    <label htmlFor={'date'+key}>{REGISTER.step3_LABEL2[props.lang]}</label>
                                    <input type="date" name="date" id={'date'+key} required value={elem.date} onChange={(e) => props.onChangeArray(key, arrayName, 'date', e.target.value)} />    
                                </div>
                            </div>
                            <input type="image" src={deleteButton} alt="Delete button img" onClick={(e) => { e.preventDefault(); props.onDeleteArray(key, arrayName) }}/>
                        </div>
                    );
                })}
                <input type="image" src={addButton} alt="Add button img" onClick={(e) => { e.preventDefault(); props.onAddArray(arrayName, defaultObj) }}/>
            </section>
        </Fragment>
    );

}

function Step4(props){
    if (props.currentStep !== 4) {
        return null;
    }
    
    const arrayName = 'favorites';
    const defaultObj = { title: '', content: ''};

    return (
        <Fragment>
            <section 
                className="formStep"
            >
                <h1 className="title">{REGISTER.step4_H11[props.lang]}</h1>
                <p>{REGISTER.step4_P1_1[props.lang]}<br/>
                {REGISTER.step3_P1_2[props.lang]}</p>
                {props.favorites.map( (elem, key) => {
                    return (
                        <div className="listItem" key={key}>
                            <div className="inputItemSection">
                                <div className="inputItem">
                                    <label htmlFor={'title'+key}>{REGISTER.step3_LABEL1[props.lang]}</label>
                                    <input type="text" name="title" id={'title'+key} required value={elem.title} onChange={(e) => props.onChangeArray(key, arrayName, 'title', e.target.value)} />
                                </div>
                                <div className="inputItem">
                                    <label htmlFor={'content'+key}>{REGISTER.step4_LABEL1[props.lang]}</label>
                                    <textarea type="text" name="content" id={'content'+key} required value={elem.content} onChange={(e) => props.onChangeArray(key, arrayName, 'content', e.target.value)}/>
                                </div>
                            </div>
                            <input type="image" src={deleteButton} alt="Delete button img" onClick={(e) => { e.preventDefault(); props.onDeleteArray(key, arrayName) }}/>
                        </div>
                    );
                })}
                <input id="addItem" type="image" src={addButton} alt="Add button img" onClick={(e) => { e.preventDefault(); props.onAddArray(arrayName, defaultObj) }}/> 
            </section>
        </Fragment>
    );


}

function Step5(props){
    if (props.currentStep !== 5) {
        return null;
    }
    
    const arrayName = 'wardrobe';
    const defaultObj = { title: '', content: ''};

    return (
        <Fragment>
            <section 
                className="formStep"
            >
                <h1 className="title">{REGISTER.step5_H11[props.lang]}</h1>
                <p>{REGISTER.step5_P1_1[props.lang]}<br/>
                {REGISTER.step3_P1_2[props.lang]}</p>
                {props.wardrobe.map( (elem, key) => {
                    return (
                        <div className="listItem" key={key}>
                            <div className="inputItemSection">
                                <div className="inputItem">
                                    <label htmlFor={'title'+key}>{REGISTER.step3_LABEL1[props.lang]}</label>
                                    <input type="text" name="title" id={'title'+key} required value={elem.title} onChange={(e) => props.onChangeArray(key, arrayName, 'title', e.target.value)} />
                                </div>
                                <div className="inputItem">
                                    <label htmlFor={'content'+key}>{REGISTER.step4_LABEL1[props.lang]}</label>
                                    <textarea type="text" name="content" id={'content'+key} required value={elem.content} onChange={(e) => props.onChangeArray(key, arrayName, 'content', e.target.value)}/>
                                </div>
                            </div>
                            <input type="image" src={deleteButton} alt="Delete button img" onClick={(e) => { e.preventDefault(); props.onDeleteArray(key, arrayName) }}/>
                        </div>
                    );
                })}
                <input id="addItem" type="image" src={addButton} alt="Add button img" onClick={(e) => { e.preventDefault(); props.onAddArray(arrayName, defaultObj) }}/> 
            </section>
        </Fragment>
    );

}

function Step6(props){
    if (props.currentStep !== 6) {
        return null;
    }
    
    const arrayName = 'lifeInfo';
    const defaultObj = { title: '', content: ''};

    return (
        <Fragment>
            <section 
                className="formStep"
            >
                <h1 className="title">{REGISTER.step6_H11[props.lang]}</h1>
                <p>{REGISTER.step6_P1_1[props.lang]} <br/>
                {REGISTER.step3_P1_2[props.lang]}</p>
                {props.lifeInfo.map( (elem, key) => {
                    return (
                        <div className="listItem" key={key}>
                            <div className="inputItemSection">
                                <div className="inputItem">
                                    <label htmlFor={'title'+key}>{REGISTER.step3_LABEL1[props.lang]}</label>
                                    <input type="text" name="title" id={'title'+key} required value={elem.title} onChange={(e) => props.onChangeArray(key, arrayName, 'title', e.target.value)} />
                                </div>
                                <div className="inputItem">
                                    <label htmlFor={'content'+key}>{REGISTER.step4_LABEL1[props.lang]}</label>
                                    <textarea type="text" name="content" id={'content'+key} required value={elem.content} onChange={(e) => props.onChangeArray(key, arrayName, 'content', e.target.value)}/>
                                </div>
                            </div>
                            <input type="image" src={deleteButton} alt="Delete button img" onClick={(e) => { e.preventDefault(); props.onDeleteArray(key, arrayName) }}/>
                        </div>
                    );
                })}
                <input id="addItem" type="image" src={addButton} alt="Add button img" onClick={(e) => { e.preventDefault(); props.onAddArray(arrayName, defaultObj) }}/> 
            </section>
        </Fragment>
    );


}



export default Register;