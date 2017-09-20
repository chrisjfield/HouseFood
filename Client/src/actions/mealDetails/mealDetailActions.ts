import {
    MealDetail,
    NewMealDetail,
} from '../../interfaces/mealDetailInterfaces';
import apiHelper from '../../helpers/apiHelper';

import { 
    startGet, stopGet, startPost, stopPost,
    startPut, stopPut, startDelete, stopDelete,
} from '../app/appLoadingActions';
import { addError } from '../app/appErrorActions';

export const GET_MEALDETAILS_SUCCESSFUL = 'GET_MEALDETAILS_SUCCESSFUL';
export const POST_BULK_MEALDETAILS_SUCCESSFUL = 'POST_BULK_MEALDETAILS_SUCCESSFUL';
export const PUT_BULK_MEALDETAILS_SUCCESSFUL = 'PUT_BULK_MEALDETAILS_SUCCESSFUL';
export const DELETE_BULK_MEALDETAILS_SUCCESSFUL = 'DELETE_BULK_MEALDETAILS_SUCCESSFUL';

export function getMealDetails() {
    const request = apiHelper.apiCall(
        'GET',
        'mealingredients',
      );

    return (dispatch: Function) => {
        dispatch(startGet());
        request
        .then((response: MealDetail[]) => {
            dispatch(getMealDetailsSuccessful(response));
            dispatch(stopGet());
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopGet());
        });
    };
}

function getMealDetailsSuccessful(response: MealDetail[]) {
    return {
        type: GET_MEALDETAILS_SUCCESSFUL,
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
        dispatch(startPost());
        request
        .then((response: MealDetail[]) => {
            dispatch(postBulkMealDetailsSuccessful(response));
            dispatch(stopPost());
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopPost());
        });
    };
}

function postBulkMealDetailsSuccessful(response: MealDetail[]) {
    return {
        type: POST_BULK_MEALDETAILS_SUCCESSFUL,
        payload: response,
    };
}

export function putBulkMealDetails(mealDetails: MealDetail[]) {
    const request = apiHelper.apiCall(
        'PUT',
        'mealingredients/bulk',
        mealDetails,
      );

    return (dispatch : Function) => {
        dispatch(startPut());
        request
        .then((response: MealDetail[]) => {
            dispatch(putBulkMealDetailsSuccessful(response));
            dispatch(stopPut());
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopPut());
        });
    };
}

function putBulkMealDetailsSuccessful(response: MealDetail[]) {
    return {
        type: PUT_BULK_MEALDETAILS_SUCCESSFUL,
        payload: response,
    };
}

export function deleteBulkMealDetails(mealDetails: MealDetail[]) {
    const request = apiHelper.apiCall(
        'DELETE',
        'mealingredients/bulk',
        mealDetails,
      );

    return (dispatch : Function) => {
        dispatch(startDelete());
        request
        .then((response: MealDetail[]) => {
            dispatch(deleteBulkMealDetailsSuccessful(response));
            dispatch(stopDelete());
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopDelete());
        });
    };
}

function deleteBulkMealDetailsSuccessful(response: MealDetail[]) {
    return {
        type: DELETE_BULK_MEALDETAILS_SUCCESSFUL,
        payload: response,
    };
}
