import { Day, NewDay } from '../../interfaces/dayInterfaces';
import { NewPerson } from '../../interfaces/personInterfaces';
import apiHelper from '../../helpers/apiHelper';

import { 
    startGet, stopGet, startPost, stopPost,
    startPut, stopPut,
} from '../app/appLoadingActions';
import { addError } from '../app/appErrorActions';
import { addPeople } from '../people/peopleActions';

export const GET_DAY_BULK_SUCCESSFUL = 'GET_DAY_BULK_SUCCESSFUL';
export const GET_DAY_SUCCESSFUL = 'GET_DAY_SUCCESSFUL';
export const POST_DAY_SUCCESSFUL = 'POST_DAY_SUCCESSFUL';
export const PUT_DAY_SUCCESSFUL = 'PUT_DAY_SUCCESSFUL';

export function getDays() {
    const request = apiHelper.apiCall(
        'GET',
        'Days',
      );
    
    return (dispatch: Function) => {
        dispatch(startGet());
        request
        .then((response: Day[]) => {
            dispatch(getDaysSuccessful(response));
            dispatch(stopGet());
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopGet());
        });
    };
}

function getDaysSuccessful(response: Day[]) {
    return {
        type: GET_DAY_BULK_SUCCESSFUL,
        payload: response,
    };
}

export function getDay(dayDate: string) {
    const endpoint = 'Days/' + dayDate;
    const request = apiHelper.apiCall(
        'GET',
        endpoint,
      );
    
    return (dispatch: Function) => {
        dispatch(startGet());
        request
        .then((response: Day) => {
            dispatch(getDaySuccessful(response));
            dispatch(stopGet());
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopGet());
        });
    };
}

function getDaySuccessful(response: Day) {
    return {
        type: GET_DAY_SUCCESSFUL,
        payload: response,
    };
}

export function addDay(newDay: NewDay, newPeople: NewPerson[]) {
    const request = apiHelper.apiCall(
        'POST',
        'Days',
        newDay,
    );
    
    return (dispatch : Function) => {
        dispatch(startPost());
        return request
        .then((response: Day[]) => {
            dispatch(postDateSuccessful(response));
            dispatch(addPeople(newPeople, newDay.date));
            dispatch(stopPost());
            return response;
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopPost());
            throw error;
        });
    };
}

function postDateSuccessful(response: Day[]) {
    return {
        type: POST_DAY_SUCCESSFUL,
        payload: response,
    };
}

export function updateDay(dayDate: string, day: NewDay) {
    const endpoint = 'Days/' + dayDate;
    const request = apiHelper.apiCall(
        'PUT',
        endpoint,
        day,
      );
    
    return (dispatch : Function) => {
        dispatch(startPut());
        return request
        .then((response: Day) => {
            dispatch(updateDaySuccessful(response));
            dispatch(stopPut());
            return response;
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopPut());
            throw error;
        });
    };
}

function updateDaySuccessful(response: Day) {
    return {
        type: PUT_DAY_SUCCESSFUL,
        payload: response,
    };
}
