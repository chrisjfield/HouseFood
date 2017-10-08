import { Action } from '../../interfaces/appInterfaces';
import { dayReducerState } from '../../interfaces/stateInterfaces';
import { Day } from '../../interfaces/dayInterfaces';

import { GET_DAY_BULK_SUCCESSFUL, GET_DAY_SUCCESSFUL,  POST_DAY_SUCCESSFUL, PUT_DAY_SUCCESSFUL } from '../../actions/days/dayActions';

function daysReducer(state: dayReducerState = { 
    days: undefined, 
},                   action: Action) {
    switch (action.type) {
    case GET_DAY_SUCCESSFUL:
        return {
            ...state,
            days: [...state.days.map((day: Day) => day.date === action.payload.date ? action.payload : day)],
        };
    case GET_DAY_BULK_SUCCESSFUL:
        return {
            ...state,
            days: action.payload,
        };
    case POST_DAY_SUCCESSFUL:
        return {
            ...state,
            days: [...state.days, action.payload],
        };
    case PUT_DAY_SUCCESSFUL:
        return {
            ...state,
            days: [...state.days.map((day: Day) => day.date === action.payload.date ? action.payload : day)],
        };
    default:
        return state;
    }
}
  
export default daysReducer;
