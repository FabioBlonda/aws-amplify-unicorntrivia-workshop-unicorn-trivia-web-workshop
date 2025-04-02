import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './styles/app.sass';
import {Amplify} from 'aws-amplify';
import config from './amplifyconfiguration.json';

Amplify.configure(config);

ReactDOM.render(
	<App />,
	document.getElementById('app')
);

module.hot.accept();
