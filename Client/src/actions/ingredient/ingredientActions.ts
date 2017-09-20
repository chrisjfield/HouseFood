import { Ingredient, NewIngredient } from '../../interfaces/ingredientInterfaces';
import apiHelper from '../../helpers/apiHelper';

import { startGet, stopGet, startPost, stopPost } from '../app/appLoadingActions';
import { addError } from '../app/appErrorActions';

export const GET_INGREDIENTS_SUCCESSFUL = 'GET_INGREDIENTS_SUCCESSFUL';
export const POST_INGREDIENTS_BULK_SUCCESSFUL = 'POST_INGREDIENTS_BULK_SUCCESSFUL';

export function getIngredients() {
    const request = apiHelper.apiCall(
        'GET',
        'Ingredients',
      );
    
    return (dispatch: Function) => {
        dispatch(startGet());
        request
        .then((response: Ingredient[]) => {
            dispatch(getIngredientsSuccessful(response));
            dispatch(stopGet());
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopGet());
        });
    };
}

function getIngredientsSuccessful(response: Ingredient[]) {
    return {
        type: GET_INGREDIENTS_SUCCESSFUL,
        payload: response,
    };
}

export function postBulkIngredients(newIngredients: NewIngredient[]) {
    const request = apiHelper.apiCall(
        'POST',
        'ingredients/bulk',
        newIngredients,
      );

    return (dispatch: Function) => {
        dispatch(startPost());
        return request
        .then((response: Ingredient[]) => {
            dispatch(postIngredientsBulkSuccessful(response));
            dispatch(stopPost());
            return response;
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopPost());
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
