import React, { Component, Fragment} from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register'
import Coniunctum from './components/Coniunctum'
import About from './components/About';
import Contact from './components/Contact';
import ResetPass from './components/ResetPass';


class App extends Component {
  render() {
    return (
      <Router>
        <Fragment>
          <Route exact path='/' render={ () => { return <Redirect to='/home/pl' /> } }/>
          
          <Route exact path='/home/:lang?' component={Landing} />
          <Route exact path="/register/:lang?" component={Register} />
          <Route exact path="/login/:lang?" component={Login} />
          <Route exact path='/about/:lang?' component={About} />
          <Route exact path='/contact/:lang?' component={Contact} />
          <Route exact path='/resetpass/:lang?' component={ResetPass} />

          <Route exact path='/coniunctum' component={Coniunctum} />
        </Fragment>
      </Router>  
    );
  }
}

export default App;
