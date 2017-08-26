import { Meal } from '../../interfaces/mealsInterfaces';
import apiHelper from '../../helpers/apiHelper';

export const GET_MEALS_STARTED = 'GET_MEALS_STARTED';
export const GET_MEALS_SUCCESSFUL = 'GET_MEALS_SUCCESSFUL';
export const GET_MEALS_FAILURE = 'GET_MEALS_FAILURE';

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
