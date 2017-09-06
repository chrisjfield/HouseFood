import { Ingredient } from '../../interfaces/ingredientInterfaces';
import { 
    GET_INGREDIENTS_STARTED,
    GET_INGREDIENTS_SUCCESSFUL,
    GET_INGREDIENTS_FAILURE,
} from '../../actions/ingredient/ingredientActions';

interface ingredientsReducerState {
    ingredients: Ingredient[];
    loading: boolean;
    updating: boolean;
    error: boolean;
}

function ingredientReducer(state: ingredientsReducerState = { 
    ingredients: undefined, 
    loading: false,
    updating: false,
    error: false,
},                         action: any) {
    switch (action.type) {
    case GET_INGREDIENTS_STARTED:
        return {
            ...state,
            loading: true,
            error: false,
        };
    case GET_INGREDIENTS_SUCCESSFUL:
        return {
            ...state,
            ingredients: action.payload,
            loading: false,
            error: false,
        };
    case GET_INGREDIENTS_FAILURE:
        return {
            ...state,
            loading: false,
            error: true,
        };
    default:
        return state;
    }
}
  
export default ingredientReducer;
