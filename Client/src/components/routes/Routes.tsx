import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import NotFound404 from '../notFound404';
import Home from '../home';
import Planner from '../planner';
import ListHeader from '../list/header';
import ListDetail from '../list/detail';
import ListEdit from '../list/edit';
import Meals from '../meals';
import MealDetails from '../mealDetails';
import MealEdit from '../mealEdit';

function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/Planner" component={Planner}/>
            <Route exact path="/List/Header" component={ListHeader}/>
            <Route exact path="/List/Detail/:listid" component={ListDetail}/>
            <Route exact path="/List/Edit/:listid" component={ListEdit}/>
            <Route exact path="/Meals" component={Meals}/>
            <Route exact path="/Meals/:mealid" component={MealDetails}/>
            <Route exact path="/Meals/Edit/:mealid" component={MealEdit}/>
            <Route path="*" component={NotFound404} />
        </Switch>
    );
}
  
export default Routes;
