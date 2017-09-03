import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../home';
import Planner from '../planner';
import ListHeader from '../list/header';
import ListDetail from '../list/detail';
import ListEdit from '../list/edit';
import MealHeader from '../meal/header';
import MealDetail from '../meal/detail';
import MealEdit from '../meal/edit';
import NotFound404 from '../notFound404';

function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/Planner" component={Planner}/>
            <Route exact path="/List/Header" component={ListHeader}/>
            <Route exact path="/List/Detail/:listid" component={ListDetail}/>
            <Route exact path="/List/Edit/:listid" component={ListEdit}/>
            <Route exact path="/Meal/Header" component={MealHeader}/>
            <Route exact path="/Meal/Detail/:mealid" component={MealDetail}/>
            <Route exact path="/Meal/Edit/:mealid" component={MealEdit}/>
            <Route path="*" component={NotFound404} />
        </Switch>
    );
}

export default Routes;
