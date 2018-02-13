import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Route
} from 'react-router-dom';

import EntryPage from './src/js/pages/EntryPage';
import HomePage from './src/js/pages/HomePage';

import './src/styles/main.scss';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Route exact path="/" component={EntryPage} />
        <Route path="/home" component={HomePage} />
      </div>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
