import { combineReducers } from 'redux';

// import the reducers from in individual components
import listsReducer from './lists';
import listDetailsReducer from './listDetails';

// combine all the reducers for export
const combinedReducers = combineReducers({
    listsReducer,
    listDetailsReducer,
});

export default combinedReducers;
