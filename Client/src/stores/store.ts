import { createStore, applyMiddleware, compose, Middleware, Store } from 'redux';
import { autoRehydrate } from 'redux-persist';

import { routerMiddleware } from 'react-router-redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import combinedReducers from '../reducers';
import history from '../history';

const rmiddleware: Middleware = routerMiddleware(history);

const store: Store<{}> = createStore(
    combinedReducers,
    undefined,
    compose(applyMiddleware(thunk, logger, rmiddleware), 
            autoRehydrate(),
    ),
);

export default store;
