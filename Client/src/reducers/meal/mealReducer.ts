import { Meal } from '../../interfaces/mealInterfaces';
import { 
    GET_MEALS_STARTED,
    GET_MEALS_SUCCESSFUL,
    GET_MEALS_FAILURE,
    SAVE_MEAL_SUCCESSFUL,
    EDIT_MEAL_SUCCESSFUL,
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
    case SAVE_MEAL_SUCCESSFUL:
        return {
            ...state,
            meals: [...state.meals, action.payload],
            loading: false,
            error: false,
        };
    case EDIT_MEAL_SUCCESSFUL:
        return {
            ...state,
            meals: [...state.meals.map((meal: Meal) => meal.mealid === action.payload.mealid ? action.payload : meal)],
            loading: false,
            error: false,
        };
    default:
        return state;
    }
}
  
export default mealReducer;
