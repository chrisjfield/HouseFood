import { Person, NewPerson } from '../../interfaces/personInterfaces';
import apiHelper from '../../helpers/apiHelper';

import { 
    startGet, stopGet, startPost, stopPost,
    startDelete, stopDelete,
} from '../app/appLoadingActions';
import { addError } from '../app/appErrorActions';
import { getDay } from '../days/dayActions';

export const GET_PEOPLE_SUCCESSFUL = 'GET_PEOPLE_SUCCESSFUL';
export const POST_PEOPLE_SUCCESSFUL = 'POST_PEOPLE_SUCCESSFUL';
export const DELETE_PEOPLE_SUCCESSFUL = 'DELETE_PEOPLE_SUCCESSFUL';

export function getPeople() {
    const request = apiHelper.apiCall(
        'GET',
        'People',
      );
    
    return (dispatch : Function) => {
        dispatch(startGet());
        request
        .then((response: Person[]) => {
            dispatch(getPeopleSuccessful(response));
            dispatch(stopGet());
        })
        .catch((error: Error) => {
            dispatch(addError(error));
            dispatch(stopGet());
        });
    };
}

function getPeopleSuccessful(response: Person[]) {
    return {
        type: GET_PEOPLE_SUCCESSFUL,
        payload: response,
    };
}

export function addPeople(newPeople: NewPerson[], newDate: string) {
    const request = apiHelper.apiCall(
        'POST',
        'People',
        newPeople,
    );

    return (dispatch: Function) => {
        dispatch(startPost());
        return request
        .then((response: Person[]) => {
            dispatch(postPeopleSuccessful(response));
            dispatch(getDay(newDate));
            dispatch(stopPost());
            return response;
        })
        .catch((error: Error) => {
            dispatch(addError(error));
            dispatch(stopPost());
            throw error;
        });
    };
}

function postPeopleSuccessful(response: Person[]) {
    return {
        type: POST_PEOPLE_SUCCESSFUL,
        payload: response,
    };
}

export function removePeople(removedPeople: Person[], newDate: string) {
    const request = apiHelper.apiCall(
        'DELETE',
        'People',
        removedPeople,
    );

    return (dispatch: Function) => {
        dispatch(startDelete());
        return request
        .then((response: any) => {
            dispatch(removePeopleSuccessful(removedPeople));
            dispatch(getDay(newDate));
            dispatch(stopDelete());
            return response;
        })
        .catch((error: Error) => {
            dispatch(addError(error));
            dispatch(stopDelete());
            throw error;
        });
    };
}

function removePeopleSuccessful(removedPeople: Person[]) {
    return {
        type: DELETE_PEOPLE_SUCCESSFUL,
        payload: removedPeople,
    };
}
