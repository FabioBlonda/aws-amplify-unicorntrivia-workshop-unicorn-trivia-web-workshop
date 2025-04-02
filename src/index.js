import React from 'react';
import ReactDOM from 'react-dom';
import {Amplify} from 'aws-amplify';
import awsmobile from './aws-exports';
import App from './components/App';
import './styles/app.sass';


Amplify.configure(awsmobile);

ReactDOM.render(
	<App />,
	document.getElementById('app')
);

module.hot.accept();
