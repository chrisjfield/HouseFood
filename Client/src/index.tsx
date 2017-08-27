import * as ReactDOM from 'react-dom';
import * as React from 'react';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './themes/index.css';
import history from './history';
import store from './stores';
import theme from './themes';
import { load } from 'webfontloader';
import * as injectTapEventPlugin from 'react-tap-event-plugin';

import App from './components/app';

load({
    google: {
        families: ['Titillium Web:300,400,700', 'sans-serif'],
    },
});

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const domElement : HTMLElement|null = document.getElementById('root');

ReactDOM.render((
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <MuiThemeProvider muiTheme={theme}>
                <App/>
            </MuiThemeProvider>
        </ConnectedRouter>
    </Provider>
    ),          domElement,
);
