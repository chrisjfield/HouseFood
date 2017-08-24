import { combineReducers } from 'redux';

// import the reducers from in individual components
import listsReducer from './lists';
import listDetailsReducer from './listDetails';
import ingredientsReducer from './ingredients';

// combine all the reducers for export
const combinedReducers = combineReducers({
    listsReducer,
    listDetailsReducer,
    ingredientsReducer,
});

export default combinedReducers;
