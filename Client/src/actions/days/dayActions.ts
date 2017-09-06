import { Day } from '../../interfaces/dayInterfaces';
import apiHelper from '../../helpers/apiHelper';

export const GET_DAYS_STARTED = 'GET_DAYS_STARTED';
export const GET_DAYS_SUCCESSFUL = 'GET_DAYS_SUCCESSFUL';
export const GET_DAYS_FAILURE = 'GET_DAYS_FAILURE';
export const GET_DAY_STARTED = 'GET_DAY_STARTED';
export const GET_DAY_SUCCESSFUL = 'GET_DAY_SUCCESSFUL';
export const GET_DAY_FAILURE = 'GET_DAY_FAILURE';

export function getDays() {
    const request = apiHelper.apiCall(
        'GET',
        'Days',
      );
    
    return (dispatch : Function) => {
        dispatch(getDaysStarted());
        request
        .then((response : Day[]) =>
          dispatch(getDaysSuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getDaysFailure(error));
        });
    };
}

function getDaysStarted() {
    return {
        type: GET_DAYS_STARTED,
    };
}

function getDaysSuccessful(response: Day[]) {
    return {
        type: GET_DAYS_SUCCESSFUL,
        payload: response,
    };
}

function getDaysFailure(error: any) {
    return {
        type: GET_DAYS_FAILURE,
        payload: error,
    };
}

export function getDay(dayDate: string) {
    const endpoint = 'Days/' + dayDate;
    const request = apiHelper.apiCall(
        'GET',
        endpoint,
      );
    
    return (dispatch : Function) => {
        dispatch(getDayStarted());
        request
        .then((response : Day) =>
          dispatch(getDaySuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getDayFailure(error));
        });
    };
}

function getDayStarted() {
    return {
        type: GET_DAY_STARTED,
    };
}

function getDaySuccessful(response: Day) {
    return {
        type: GET_DAY_SUCCESSFUL,
        payload: response,
    };
}

function getDayFailure(error: any) {
    return {
        type: GET_DAY_FAILURE,
        payload: error,
    };
}
