import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import NotFound404 from '../notFound404';
import Home from '../home';
import Planner from '../planner';
import Lists from '../lists';
import ListDetails from '../listDetails';
import Meals from '../meals';
import MealDetails from '../mealDetails';
import MealEdit from '../mealEdit';

function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/Planner" component={Planner}/>
            <Route exact path="/Lists" component={Lists}/>
            <Route exact path="/Lists/:listid" component={ListDetails}/>
            <Route exact path="/Meals" component={Meals}/>
            <Route exact path="/Meals/:mealid" component={MealDetails}/>
            <Route exact path="/Meals/Edit/:mealid" component={MealEdit}/>
            <Route path="*" component={NotFound404} />
        </Switch>
    );
}
  
export default Routes;
