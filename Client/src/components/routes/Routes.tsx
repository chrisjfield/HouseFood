import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import NotFound404 from '../notFound404';
import Lists from '../lists';
import ListDetails from '../listDetails';
import Meals from '../meals';
import MealDetails from '../mealDetails';

function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={NotFound404}/>
            <Route exact path="/Lists" component={Lists}/>
            <Route exact path="/Lists/:listid" component={ListDetails}/>
            <Route exact path="/Meals" component={Meals}/>
            <Route exact path="/Meals/:mealid" component={MealDetails}/>
            <Route path="*" component={NotFound404} />
        </Switch>
    );
}
  
export default Routes;
