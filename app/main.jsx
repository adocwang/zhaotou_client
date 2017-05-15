import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';


import IndexPage from "./components/IndexPage/IndexPage";
import SearchPage from "./components/SearchPage/SearchPage";
import CompanyDetail from "./components/CompanyDetail/CompanyDetail";


require('./main.css');
ReactDOM.render(
    (<Router history={hashHistory}>
          <Route path="/" component={App}>
              <IndexRoute component={SearchPage}/>
              <Route path="index" component={IndexPage}/>
              <Route path="search" component={SearchPage}/>
              <Route path="company_detail/:compId" component={CompanyDetail}/>
          </Route>
      </Router>
    ),
  document.body.appendChild(document.createElement('div'))
);
