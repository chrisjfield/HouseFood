import { 
    Ingredient,
    NewIngredient, 
} from '../../interfaces/ingredientInterfaces';
import apiHelper from '../../helpers/apiHelper';

export const GET_INGREDIENTS_STARTED = 'GET_INGREDIENTS_STARTED';
export const GET_INGREDIENTS_SUCCESSFUL = 'GET_INGREDIENTS_SUCCESSFUL';
export const GET_INGREDIENTS_FAILURE = 'GET_INGREDIENTS_FAILURE';
export const POST_INGREDIENTS_BULK_SUCCESSFUL = 'POST_INGREDIENTS_BULK_SUCCESSFUL';

export function getIngredients() {
    const request = apiHelper.apiCall(
        'GET',
        'Ingredients',
      );
    
    return (dispatch : Function) => {
        dispatch(getIngredientsStarted());
        request
        .then((response : Ingredient[]) =>
          dispatch(getIngredientsSuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getIngredientsFailure(error));
        });
    };
}

function getIngredientsStarted() {
    return {
        type: GET_INGREDIENTS_STARTED,
    };
}

function getIngredientsSuccessful(response: Ingredient[]) {
    return {
        type: GET_INGREDIENTS_SUCCESSFUL,
        payload: response,
    };
}

function getIngredientsFailure(error: any) {
    return {
        type: GET_INGREDIENTS_FAILURE,
        payload: error,
    };
}

export function postBulkIngredients(newIngredients: NewIngredient[]) {
    const request = apiHelper.apiCall(
        'POST',
        'ingredients/bulk',
        newIngredients,
      );

    return (dispatch : Function) => {
        dispatch(getIngredientsStarted());
        return request
        .then((response : Ingredient[]) => {
            dispatch(postIngredientsBulkSuccessful(response));
            return response;
        })
        .catch((error: any) => {
            console.log(error);
            dispatch(getIngredientsFailure(error));
            throw(error);
        });
    };
}

function postIngredientsBulkSuccessful(response: Ingredient[]) {
    return {
        type: POST_INGREDIENTS_BULK_SUCCESSFUL,
        payload: response,
    };
}
