import { Day } from '../../interfaces/daysInterfaces';
import { 
    GET_DAYS_STARTED,
    GET_DAYS_SUCCESSFUL,
    GET_DAYS_FAILURE,
    UPDATE_DAY_STARTED,
    UPDATE_DAY_SUCCESSFUL,
    UPDATE_DAY_FAILURE,
} from '../../actions/days/dayActions';
import { 
    POST_DAYS_STARTED,
    POST_DAYS_SUCCESSFUL,
    POST_DAYS_FAILURE,
} from '../../actions/planner/plannerActions';

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
    case POST_DAYS_STARTED:
        return {
            ...state,
            loading: true,
            error: false,
        };
    case POST_DAYS_SUCCESSFUL:
        return {
            ...state,
            days: [...state.days, action.payload],
            loading: false,
            error: false,
        };
    case POST_DAYS_FAILURE:
        return {
            ...state,
            loading: false,
            error: true,
        };
    case UPDATE_DAY_STARTED:
        return {
            ...state,
            loading: true,
            error: false,
        };
    case UPDATE_DAY_SUCCESSFUL:
        return {
            ...state,
            days: state.days.map((day: Day) => day.date === action.payload.date ? action.payload : day),
            loading: false,
            error: false,
        };
    case UPDATE_DAY_FAILURE:
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
