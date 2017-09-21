import { ADD_ERROR, REMOVE_ERROR } from '../../actions/app/appErrorActions';
import { 
    START_GET, START_POST, START_PUT, START_DELETE,
    STOP_GET, STOP_POST, STOP_PUT, STOP_DELETE,
} from '../../actions/app/appLoadingActions';

interface appReducerState {
    getting: number;
    posting: number;
    putting: number;
    deleting: number;
    errorMessage: string;
}

function appReducer(state: appReducerState = { 
    getting: 0,
    posting: 0,
    putting: 0,
    deleting: 0,
    errorMessage: undefined, 
},                  action: any) {
    switch (action.type) {
    case ADD_ERROR:
        return {
            ...state,
            errorMessage: action.payload,
        };
    case REMOVE_ERROR:
        return {
            ...state,
            errorMessage: undefined,
        };
    case START_GET:
        return {
            ...state,
            getting: state.getting + 1,
        };
    case STOP_GET:
        return {
            ...state,
            getting: state.getting > 0 ? state.getting - 1 : 0,
        };
    case START_POST:
        return {
            ...state,
            posting: state.posting + 1,
        };
    case STOP_POST:
        return {
            ...state,
            posting: state.posting > 0 ? state.posting - 1 : 0,
        };
    case START_PUT:
        return {
            ...state,
            putting: state.putting + 1,
        };
    case STOP_PUT:
        return {
            ...state,
            putting: state.putting > 0 ? state.putting - 1 : 0,
        };
    case START_DELETE:
        return {
            ...state,
            deleting: state.deleting + 1,
        };
    case STOP_DELETE:
        return {
            ...state,
            deleting: state.deleting > 0 ? state.deleting - 1 : 0,
        };
    default:
        return state;
    }
}

export default appReducer;
