import { 
    Meal, 
    NewMeal, 
} from '../../interfaces/mealInterfaces';
import apiHelper from '../../helpers/apiHelper';

import { 
    startGet, stopGet, startPost, stopPost,
    startPut, stopPut,
} from '../app/appLoadingActions';
import { addError } from '../app/appErrorActions';

export const GET_MEALS_SUCCESSFUL = 'GET_MEALS_SUCCESSFUL';
export const POST_MEAL_SUCCESSFUL = 'POST_MEAL_SUCCESSFUL';
export const PUT_MEAL_SUCCESSFUL = 'PUT_MEAL_SUCCESSFUL';

export function getMeals() {
    const request = apiHelper.apiCall(
        'GET',
        'meals',
      );
    
    return (dispatch : Function) => {
        dispatch(startGet());
        request
        .then((response: Meal[]) => {
            dispatch(getMealsSuccessful(response));
            dispatch(stopGet());
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopGet());
        });
    };
}

function getMealsSuccessful(response: Meal[]) {
    return {
        type: GET_MEALS_SUCCESSFUL,
        payload: response,
    };
}

export function saveMeal(meal: NewMeal) {
    const request = apiHelper.apiCall(
        'POST',
        'meals',
        meal,
      );
    
    return (dispatch: Function) => {
        dispatch(startPost());
        return request
        .then((response: Meal) => {
            dispatch(saveMealSuccessful(response));
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

function saveMealSuccessful(response: Meal) {
    return {
        type: POST_MEAL_SUCCESSFUL,
        payload: response,
    };
}

export function editMeal(meal: Meal) {
    const url: string = 'Meals/' + String(meal.mealid);
    const request = apiHelper.apiCall(
        'PUT',
        url,
        meal,
      );
    
    return (dispatch: Function) => {
        dispatch(startPut());
        request
        .then((response : Meal) => {
            dispatch(editMealSuccessful(response));
            dispatch(stopPut());
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopPut());
        });
    };
}

function editMealSuccessful(response: Meal) {
    return {
        type: PUT_MEAL_SUCCESSFUL,
        payload: response,
    };
}
