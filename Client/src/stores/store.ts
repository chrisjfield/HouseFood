import { createStore, applyMiddleware, compose, Middleware, Store } from 'redux';
import { persistStore, autoRehydrate, PersistorConfig } from 'redux-persist';

import { routerMiddleware } from 'react-router-redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import * as localForage from 'localforage';

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

const persistConfig: PersistorConfig = {
    blacklist: ['appReducer'],
    storage: localForage,
};

persistStore(store, persistConfig);

export default store;
