import { combineReducers } from 'redux';

import listReducer from './list';
import listDetailReducer from './listDetail';
import ingredientReducer from './ingredients';
import mealReducer from './meal';
import mealDetailReducer from './mealDetail';
import dayReducer from './days';
import personReducer from './person';
import appReducer from './app';

const combinedReducers = combineReducers({
    listReducer,
    listDetailReducer,
    ingredientReducer,
    mealReducer,
    mealDetailReducer,
    dayReducer,
    personReducer,
    appReducer,
});

export default combinedReducers;
