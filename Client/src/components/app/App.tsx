import * as React from 'react';

import Routes from '../routes';
import Header from '../header';
import { AppError } from '../errorHandling';

function App() {
    return (
        <div>
            <Header/>
            <Routes/>
            <AppError/>
        </div>
    );
}

export default App;
