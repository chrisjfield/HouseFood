import { Day } from '../../interfaces/daysInterfaces';
import { 
    GET_DAYS_STARTED,
    GET_DAYS_SUCCESSFUL,
    GET_DAYS_FAILURE,
} from '../../actions/days/dayActions';

interface daysReducerState {
    days: Day[];
    loading: boolean;
    updating: boolean;
    error: boolean;
}

function daysReducer(state: daysReducerState = { 
    days: undefined, 
    loading: false,
    updating: false,
    error: false,
},                   action: any) {
    switch (action.type) {
    case GET_DAYS_STARTED:
        return {
            ...state,
            loading: true,
            error: false,
        };
    case GET_DAYS_SUCCESSFUL:
        return {
            ...state,
            days: action.payload,
            loading: false,
            error: false,
        };
    case GET_DAYS_FAILURE:
        return {
            ...state,
            loading: false,
            error: true,
        };
    default:
        return state;
    }
}
  
export default daysReducer;
