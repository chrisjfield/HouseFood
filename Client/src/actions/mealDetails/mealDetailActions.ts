import {
    MealDetail,
    NewMealDetail,
} from '../../interfaces/mealDetailInterfaces';
import apiHelper from '../../helpers/apiHelper';

export const GET_MEALDETAILS_STARTED = 'GET_MEALDETAILS_STARTED';
export const GET_MEALDETAILS_SUCCESSFUL = 'GET_MEALDETAILS_SUCCESSFUL';
export const GET_MEALDETAILS_FAILURE = 'GET_MEALDETAILS_FAILURE';
export const PUT_BULK_MEALDETAILS_SUCCESSFUL = 'PUT_BULK_MEALDETAILS_SUCCESSFUL';
export const DELETE_BULK_MEALDETAILS_SUCCESSFUL = 'DELETE_BULK_MEALDETAILS_SUCCESSFUL';
export const POST_BULK_MEALDETAILS_SUCCESSFUL = 'POST_BULK_MEALDETAILS_SUCCESSFUL';

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

export function putBulkMealDetails(mealDetails: MealDetail[]) {
    const request = apiHelper.apiCall(
        'PUT',
        'mealingredients/bulk',
        mealDetails,
      );

    return (dispatch : Function) => {
        dispatch(getMealDetailsStarted());
        request
        .then((response : MealDetail[]) =>
          dispatch(putBulkMealDetailsSuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getMealDetailsFailure(error));
        });
    };
}

function putBulkMealDetailsSuccessful(response: MealDetail[]) {
    return {
        type: PUT_BULK_MEALDETAILS_SUCCESSFUL,
        payload: response,
    };
}

export function deletetBulkMealDetails(mealDetails: MealDetail[]) {
    const request = apiHelper.apiCall(
        'DELETE',
        'mealingredients/bulk',
        mealDetails,
      );

    return (dispatch : Function) => {
        dispatch(getMealDetailsStarted());
        request
        .then((response : any) =>
          dispatch(deleteBulkMealDetailsSuccessful(mealDetails)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getMealDetailsFailure(error));
        });
    };
}

function deleteBulkMealDetailsSuccessful(response: MealDetail[]) {
    return {
        type: DELETE_BULK_MEALDETAILS_SUCCESSFUL,
        payload: response,
    };
}

export function postBulkMealDetails(mealDetails: NewMealDetail[]) {
    const request = apiHelper.apiCall(
        'POST',
        'mealingredients/bulk',
        mealDetails,
      );

    return (dispatch : Function) => {
        dispatch(getMealDetailsStarted());
        request
        .then((response : MealDetail[]) =>
          dispatch(postBulkMealDetailsSuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getMealDetailsFailure(error));
        });
    };
}

function postBulkMealDetailsSuccessful(response: MealDetail[]) {
    return {
        type: POST_BULK_MEALDETAILS_SUCCESSFUL,
        payload: response,
    };
}
