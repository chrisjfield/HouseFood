import { MealDetail } from '../../interfaces/mealDetailsInterfaces';
import apiHelper from '../../helpers/apiHelper';

export const GET_MEALDETAILS_STARTED = 'GET_MEALDETAILS_STARTED';
export const GET_MEALDETAILS_SUCCESSFUL = 'GET_MEALDETAILS_SUCCESSFUL';
export const GET_MEALDETAILS_FAILURE = 'GET_MEALDETAILS_FAILURE';

export function getMealDetails() {
    const request = apiHelper.apiCall(
        'GET',
        'mealingredients',
      );
    
    return (dispatch : Function) => {
        dispatch(getMealDetailsStarted());
        request
        .then((response : MealDetail[]) =>
          dispatch(getMealDetailsSuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getMealDetailsFailure(error));
        });
    };
}

function getMealDetailsStarted() {
    return {
        type: GET_MEALDETAILS_STARTED,
    };
}

function getMealDetailsSuccessful(response: MealDetail[]) {
    return {
        type: GET_MEALDETAILS_SUCCESSFUL,
        payload: response,
    };
}

function getMealDetailsFailure(error: any) {
    return {
        type: GET_MEALDETAILS_FAILURE,
        payload: error,
    };
}
