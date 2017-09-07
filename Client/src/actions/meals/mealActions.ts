import history from '../../history';

import { 
    Meal, 
    NewMeal, 
} from '../../interfaces/mealInterfaces';
import apiHelper from '../../helpers/apiHelper';

export const GET_MEALS_STARTED = 'GET_MEALS_STARTED';
export const GET_MEALS_SUCCESSFUL = 'GET_MEALS_SUCCESSFUL';
export const GET_MEALS_FAILURE = 'GET_MEALS_FAILURE';
export const POST_MEAL_SUCCESSFUL = 'POST_MEAL_SUCCESSFUL';
export const PUT_MEAL_SUCCESSFUL = 'PUT_MEAL_SUCCESSFUL';

export function getMeals() {
    const request = apiHelper.apiCall(
        'GET',
        'meals',
      );
    
    return (dispatch : Function) => {
        dispatch(getMealsStarted());
        request
        .then((response : Meal[]) =>
          dispatch(getMealsSuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getMealsFailure(error));
        });
    };
}

function getMealsStarted() {
    return {
        type: GET_MEALS_STARTED,
    };
}

function getMealsSuccessful(response: Meal[]) {
    return {
        type: GET_MEALS_SUCCESSFUL,
        payload: response,
    };
}

function getMealsFailure(error: any) {
    return {
        type: GET_MEALS_FAILURE,
        payload: error,
    };
}

export function saveMeal(meal: NewMeal) {
    const request = apiHelper.apiCall(
        'POST',
        'meals',
        meal,
      );
    
    return (dispatch : Function) => {
        dispatch(getMealsStarted());
        request
        .then((response : Meal) => {
            const url: string = '/Meal/Edit/' + String(response.mealid);
            dispatch(saveMealSuccessful(response)),
            history.push(url);
        })
        .catch((error : any) => {
            console.log(error);
            dispatch(getMealsFailure(error));
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
    
    return (dispatch : Function) => {
        dispatch(getMealsStarted());
        request
        .then((response : Meal) => 
            dispatch(editMealSuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getMealsFailure(error));
        });
    };
}

function editMealSuccessful(response: Meal) {
    return {
        type: PUT_MEAL_SUCCESSFUL,
        payload: response,
    };
}
