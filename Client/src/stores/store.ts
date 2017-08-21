import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';

import logger from 'redux-logger';
import thunk from 'redux-thunk';

import combinedReducers from '../reducers';
import history from '../history';

import { routerMiddleware } from 'react-router-redux';

const rmiddleware = routerMiddleware(history);

const store = createStore(
    combinedReducers,
    undefined,
    compose(applyMiddleware(thunk, logger, rmiddleware), 
            autoRehydrate(),
    ),
);

persistStore(store);

export default store;
