import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home, Pokemon } from '../pages';
export function Routers() {
    return (
        <Router>
            <Switch>
                <Route path='/' exact component={Home}/>
                <Route path='/pokemon/:id' component={Pokemon} />
                <Route path='*' component={() => <h1>Page not found</h1>} />
            </Switch>
        </Router>
    );
}
