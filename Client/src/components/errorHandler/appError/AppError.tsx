import * as React from 'react';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { removeError } from '../../../actions/app/appErrorActions';

import Snackbar from 'material-ui/Snackbar';

interface AppErrorProps {
    dispatch: Dispatch<{}>;
}

interface AppErrorState {
    errorMessage: string;
}

class AppError extends React.Component<AppErrorProps, AppErrorState> {
    constructor(props: any) {
        super();
        this.state = {
            errorMessage: undefined,
        };
    }

    componentWillReceiveProps(nextProps: any) {
        this.setState({ 
            errorMessage: nextProps.errorMessage, 
        });
    }

    buildErrors = () => {
        const errorMessage: string = this.state.errorMessage;
        const error: JSX.Element = (
            <Snackbar
                open={!errorMessage}
                message={errorMessage}
                autoHideDuration={4000}
                onRequestClose={this.handleClose}
                bodyStyle={{ 
                    textAlign: 'center', 
                }}
            />
        );

        return error;
    }

    handleClose = () => {
        this.setState({ 
            errorMessage: undefined, 
        });
        this.props.dispatch(removeError());
    }

    render() {
        return (
            <div>
                {this.state && this.state.errorMessage ? this.buildErrors() : null}
            </div>
        );
    }
}

const mapStateToProps = (store : any, props : any) => {
    return {
        errorMessage: store.appReducer.errorMessage,
    };
};

const ConnectedAppError = connect(mapStateToProps)(AppError);
export default ConnectedAppError;
