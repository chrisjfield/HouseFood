import { MealDetail } from '../../interfaces/mealDetailsInterfaces';
import { 
    GET_MEALDETAILS_STARTED,
    GET_MEALDETAILS_SUCCESSFUL,
    GET_MEALDETAILS_FAILURE,
} from '../../actions/mealDetails/mealDetailActions';

interface mealDetailsReducerState {
    mealDetails: MealDetail[];
    loading: boolean;
    updating: boolean;
    error: boolean;
}

function mealDetailsReducer(state: mealDetailsReducerState = { 
    mealDetails: undefined, 
    loading: false,
    updating: false,
    error: false,
},                          action: any) {
    switch (action.type) {
    case GET_MEALDETAILS_STARTED:
        return {
            ...state,
            loading: true,
            error: false,
        };
    case GET_MEALDETAILS_SUCCESSFUL:
        return {
            ...state,
            mealDetails: action.payload,
            loading: false,
            error: false,
        };
    case GET_MEALDETAILS_FAILURE:
        return {
            ...state,
            loading: false,
            error: true,
        };
    default:
        return state;
    }
}
  
export default mealDetailsReducer;
