import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import './src/js/bootstrap';

import EntryPage from './src/js/pages/EntryPage';

import './src/styles/main.scss';

ReactDOM.render(<EntryPage />, document.getElementById('app'));
