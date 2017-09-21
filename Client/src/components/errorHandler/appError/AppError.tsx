import * as React from 'react';

import { connect } from 'react-redux';

import { AppStore } from '../../../interfaces/stateInterfaces';
import { AppErrorProps } from '../../../interfaces/appInterfaces';

import { removeError } from '../../../actions/app/appErrorActions';

import styles from '../../../styles';

import Snackbar from 'material-ui/Snackbar';

class AppError extends React.Component<AppErrorProps> {

    buildErrors = () => {
        const errorMessage: string = this.props.errorMessage;
        const error: JSX.Element = (
            <Snackbar
                open={errorMessage ? true : false}
                message={errorMessage}
                autoHideDuration={4000}
                onRequestClose={this.handleClose}
                bodyStyle={styles.snackbarBody}
            />
        );
        return error;
    }

    handleClose = () => {
        this.props.dispatch(removeError());
    }

    render() {
        return (
            <div>
                {this.props.errorMessage ? this.buildErrors() : null}
            </div>
        );
    }
}

const mapStateToProps = (store: AppStore) => {
    return {
        errorMessage: store.appReducer.errorMessage,
    };
};

const ConnectedAppError = connect(mapStateToProps)(AppError);
export default ConnectedAppError;
