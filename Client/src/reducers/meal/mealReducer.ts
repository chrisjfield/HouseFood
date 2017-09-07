import { mealReducerState } from '../../interfaces/stateInterfaces';
import { Meal } from '../../interfaces/mealInterfaces';
import { GET_MEALS_SUCCESSFUL, POST_MEAL_SUCCESSFUL, PUT_MEAL_SUCCESSFUL } from '../../actions/meals/mealActions';

function mealReducer(state: mealReducerState = { 
    meals: undefined, 
},                   action: any) {
    switch (action.type) {
    case GET_MEALS_SUCCESSFUL:
        return {
            ...state,
            meals: action.payload,
        };
    case POST_MEAL_SUCCESSFUL:
        return {
            ...state,
            meals: [...state.meals, ...action.payload],
        };
    case PUT_MEAL_SUCCESSFUL:
        return {
            ...state,
            meals: [...state.meals.map((meal: Meal) => meal.mealid === action.payload.mealid ? action.payload : meal)],
        };
    default:
        return state;
    }
}
  
export default mealReducer;
