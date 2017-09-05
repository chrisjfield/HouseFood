import { ADD_ERROR, REMOVE_ERROR } from '../../components/errorHandling/appError/appErrorActions';

interface errorReducerState {
    errorMessageText: string;
}

function errorMessageReducer(state: errorReducerState = { 
    errorMessageText: undefined, 
},                           action: any) {
    switch (action.type) {
    case ADD_ERROR:
        return {
            ...state,
            errorMessageText: action.payload,
        };
    case REMOVE_ERROR:
        return {
            ...state,
            errorMessageText: undefined,
        };
    default:
        return state;
    }
}

export default errorMessageReducer;
