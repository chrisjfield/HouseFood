import { Action } from '../../interfaces/appInterfaces';
import { ingredientReducerState } from '../../interfaces/stateInterfaces';

import { GET_INGREDIENTS_SUCCESSFUL, POST_INGREDIENTS_BULK_SUCCESSFUL } from '../../actions/ingredient/ingredientActions';

function ingredientReducer(state: ingredientReducerState = { 
    ingredients: undefined, 
},                         action: Action) {
    switch (action.type) {
    case GET_INGREDIENTS_SUCCESSFUL:
        return {
            ...state,
            ingredients: action.payload,
        };
    case POST_INGREDIENTS_BULK_SUCCESSFUL:
        return {
            ...state,
            ingredients: [...state.ingredients, ...action.payload],
        };
    default:
        return state;
    }
}
  
export default ingredientReducer;
