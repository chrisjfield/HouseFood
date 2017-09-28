import * as React from 'react';

import CircularProgress from 'material-ui/CircularProgress';

import styles from '../../styles';

export function AppLoading() {
    return (
        <div>
            <CircularProgress size={80} thickness={5} style={styles.loading}/>
        </div>
    );
}

export function AppUpdating() {
    return (
        <div>
            <CircularProgress key="updating" size={30} thickness={2}/>
        </div>
    );
}
