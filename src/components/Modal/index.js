import React from 'react';
import Modal from './component';
import {Amplify} from 'aws-amplify';
import config from './../../amplifyconfiguration.json';

Amplify.configure(config);

export default Modal;