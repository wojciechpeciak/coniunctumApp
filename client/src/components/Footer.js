import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import './Footer.css';
import { FOOTER } from '../TextContent';

class Footer extends Component {

    render() {
        const {lang} = this.props.match.params;
        return(
            <footer className='publicFooter'>
                <p>
                {FOOTER.P1_1[lang]}&#10084;{FOOTER.P1_2[lang]}&#9789;
                </p>
            </footer>
        );
    }
}

export default withRouter(Footer);