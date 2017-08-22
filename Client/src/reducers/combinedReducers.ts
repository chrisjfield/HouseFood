import { combineReducers } from 'redux';

// import the reducers from in individual components
import listsReducer from './lists';

// combine all the reducers for export
const combinedReducers = combineReducers({
    listsReducer,
});

export default combinedReducers;
