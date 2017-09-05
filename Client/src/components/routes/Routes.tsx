import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../home';
import Planner from '../planner';
import { ListHeader, ListDetail, ListEdit } from '../list';
import { MealHeader, MealDetail, MealEdit } from '../meal';
import { NotFound404 } from '../errorHandler';

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
