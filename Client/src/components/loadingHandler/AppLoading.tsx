import * as React from 'react';

import CircularProgress from 'material-ui/CircularProgress';

function AppLoading() {
    return (
        <div>
            <CircularProgress size={80} thickness={5} />
        </div>
    );
}

export default AppLoading;
