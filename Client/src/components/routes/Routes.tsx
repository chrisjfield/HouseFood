import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';

import Lists from '../lists';
import NotFound404 from '../notFound404';

interface RoutesProps {
    isLoggedIn: boolean;
    isOrganisation: boolean;
    isUser: boolean;
}

class Routes extends React.Component<any> {
    constructor(props: RoutesProps) {
        super();
    }

    render() {
        return (
            <Switch>
                <Route exact path="/" component={Lists}/>
                <Route exact path="/Lists" component={Lists}/>
                <Route path="*" component={NotFound404} />
            </Switch>
        );
    }
}
  
const mapStateToProps = (store: any, props: any) : any => {
    return undefined;
};
  
const ConnectedRoutes = withRouter(connect(mapStateToProps)(Routes));
export default ConnectedRoutes;

