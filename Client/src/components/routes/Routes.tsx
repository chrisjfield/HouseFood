import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import Lists from '../lists';
import NotFound404 from '../notFound404';

function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={Lists}/>
            <Route exact path="/Lists" component={Lists}/>
            <Route path="*" component={NotFound404} />
        </Switch>
    );
}
  
export default Routes;
