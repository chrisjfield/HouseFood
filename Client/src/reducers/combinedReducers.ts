import { combineReducers } from 'redux';

// import the reducers from in individual components
import listsReducer from './lists';
import listDetailsReducer from './listDetails';
import ingredientsReducer from './ingredients';
import mealReducer from './meals';
import mealDetailsReducer from './mealDetails';

// combine all the reducers for export
const combinedReducers = combineReducers({
    listsReducer,
    listDetailsReducer,
    ingredientsReducer,
    mealReducer,
    mealDetailsReducer,
});

export default combinedReducers;
