import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Router, Route } from 'react-router'
import {history as browserHistory} from './browserHistory';
import * as serviceWorker from './serviceWorker'
import AuthorBox from './module/Author';
import Home from './module/Home';
import BookBox from './module/Book';

ReactDOM.render(
  (<Router history={ browserHistory }>
    <div>
      <App>
        <Route exact path="/" component={ Home }/>
        <Route path="/author" component={ AuthorBox }/>
        <Route path="/book" component={ BookBox }/>
      </App>
    </div>
  </Router>),
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
