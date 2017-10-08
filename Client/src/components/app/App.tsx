import * as React from 'react';

import { persistStore, PersistorConfig } from 'redux-persist';
import * as localForage from 'localforage';

import store from '../../stores';

import { AppProps, AppState } from '../../interfaces/appInterfaces';

import Routes from '../routes';
import Header from '../header';
import { AppError } from '../errorHandler';
import { AppLoading } from '../loadingHandler';

import styles from '../../styles';

const persistConfig: PersistorConfig = {
    blacklist: ['appReducer'],
    storage: localForage,
};

class App extends React.Component<AppProps, AppState> {

    constructor() {
        super();
        this.state = { rehydrated: false };
    }

    componentWillMount() {
        persistStore(store, persistConfig, () => {
            this.setState({ rehydrated: true });
        });
    }

    getApp() {
        return (
            <div>
                <div style={styles.header}>
                    <Header/>
                </div>
                <div style={styles.content}>
                    <Routes/>
                    <AppError/>
                </div>
            </div>
        );
    }
      
    render() {
        return this.state.rehydrated ? this.getApp() : <AppLoading/>; 
    }
}

export default App;
