import { Day } from '../../interfaces/daysInterfaces';
import apiHelper from '../../helpers/apiHelper';

export const GET_DAYS_STARTED = 'GET_DAYS_STARTED';
export const GET_DAYS_SUCCESSFUL = 'GET_DAYS_SUCCESSFUL';
export const GET_DAYS_FAILURE = 'GET_DAYS_FAILURE';
export const UPDATE_DAY_STARTED = 'UPDATE_DAY_STARTED';
export const UPDATE_DAY_SUCCESSFUL = 'UPDATE_DAY_SUCCESSFUL';
export const UPDATE_DAY_FAILURE = 'UPDATE_DAY_FAILURE';

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

export function updateDay(dayDate: string) {
    const endpoint = 'Days/' + dayDate;
    const request = apiHelper.apiCall(
        'GET',
        endpoint,
      );
    
    return (dispatch : Function) => {
        dispatch(updateDayStarted());
        request
        .then((response : Day) =>
          dispatch(updateDaySuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(updateDayFailure(error));
        });
    };
}

function updateDayStarted() {
    return {
        type: UPDATE_DAY_STARTED,
    };
}

function updateDaySuccessful(response: Day) {
    return {
        type: UPDATE_DAY_SUCCESSFUL,
        payload: response,
    };
}

function updateDayFailure(error: any) {
    return {
        type: UPDATE_DAY_FAILURE,
        payload: error,
    };
}
