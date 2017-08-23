import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import Lists from '../lists';
import NotFound404 from '../notFound404';
import listDetails from '../listDetails';

function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={NotFound404}/>
            <Route exact path="/Lists" component={Lists}/>
            <Route exact path="/Lists/:listid" component={listDetails}/>
            <Route path="*" component={NotFound404} />
        </Switch>
    );
}
  
export default Routes;
