import { combineReducers } from 'redux';

// import the reducers from in individual components
import shoppingListReducer from './shoppingList';

// combine all the reducers for export
const combinedReducers = combineReducers({
    shoppingListReducer,
});

export default combinedReducers;
