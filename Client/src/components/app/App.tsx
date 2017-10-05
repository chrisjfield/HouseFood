import * as React from 'react';

import Routes from '../routes';
import Header from '../header';
import { AppError } from '../errorHandler';

import styles from '../../styles';

function App() {
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

export default App;
