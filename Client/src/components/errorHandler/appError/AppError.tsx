import * as React from 'react';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { removeError } from './appErrorActions';

import Snackbar from 'material-ui/Snackbar';

interface AppErrorProps {
    dispatch: Dispatch<{}>;
}

interface AppErrorState {
    errorText: string;
}

class AppError extends React.Component<AppErrorProps, AppErrorState> {
    constructor(props: any) {
        super();
        this.state = {
            errorText: undefined,
        };
    }

    componentWillReceiveProps(nextProps: any) {
        this.setState({ 
            errorText: nextProps.errorText, 
        });
    }

    buildErrors = () => {
        const errorText: string = this.state.errorText;
        const errorMessage: JSX.Element = (
            <Snackbar
                open={!errorText}
                message={errorText}
                autoHideDuration={4000}
                onRequestClose={this.handleClose}
                bodyStyle={{ 
                    textAlign: 'center', 
                }}
            />
        );

        return errorMessage;
    }

    handleClose = () => {
        this.setState({ 
            errorText: undefined, 
        });
        this.props.dispatch(removeError());
    }

    render() {
        return (
            <div>
                {!this.state.errorText ? this.buildErrors() : undefined}
            </div>
        );
    }
}

const mapStateToProps = (store : any, props : any) => {
    return {
        errorText: store.errorReducer.errorText,
    };
};

const ConnectedAppError = connect(mapStateToProps)(AppError);
export default ConnectedAppError;
