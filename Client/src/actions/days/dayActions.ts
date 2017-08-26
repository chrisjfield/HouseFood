import { Day } from '../../interfaces/daysInterfaces';
import apiHelper from '../../helpers/apiHelper';

export const GET_DAYS_STARTED = 'GET_DAYS_STARTED';
export const GET_DAYS_SUCCESSFUL = 'GET_DAYS_SUCCESSFUL';
export const GET_DAYS_FAILURE = 'GET_DAYS_FAILURE';

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
