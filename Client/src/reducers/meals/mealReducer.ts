import { Meal } from '../../interfaces/mealsInterfaces';
import { 
    GET_MEALS_STARTED,
    GET_MEALS_SUCCESSFUL,
    GET_MEALS_FAILURE,
} from '../../actions/meals/mealActions';

interface mealReducerState {
    meals: Meal[];
    loading: boolean;
    updating: boolean;
    error: boolean;
}

function mealReducer(state: mealReducerState = { 
    meals: undefined, 
    loading: false,
    updating: false,
    error: false,
},                   action: any) {
    switch (action.type) {
    case GET_MEALS_STARTED:
        return {
            ...state,
            loading: true,
            error: false,
        };
    case GET_MEALS_SUCCESSFUL:
        return {
            ...state,
            meals: action.payload,
            loading: false,
            error: false,
        };
    case GET_MEALS_FAILURE:
        return {
            ...state,
            loading: false,
            error: true,
        };
    default:
        return state;
    }
}
  
export default mealReducer;
