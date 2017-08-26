import { Person } from '../../interfaces/peopleInterfaces';
import apiHelper from '../../helpers/apiHelper';

export const GET_PEOPLE_STARTED = 'GET_PEOPLE_STARTED';
export const GET_PEOPLE_SUCCESSFUL = 'GET_PEOPLE_SUCCESSFUL';
export const GET_PEOPLE_FAILURE = 'GET_PEOPLE_FAILURE';

export function getPeople() {
    const request = apiHelper.apiCall(
        'GET',
        'People',
      );
    
    return (dispatch : Function) => {
        dispatch(getPeopleStarted());
        request
        .then((response : Person[]) =>
          dispatch(getPeopleSuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getPeopleFailure(error));
        });
    };
}

function getPeopleStarted() {
    return {
        type: GET_PEOPLE_STARTED,
    };
}

function getPeopleSuccessful(response: Person[]) {
    return {
        type: GET_PEOPLE_SUCCESSFUL,
        payload: response,
    };
}

function getPeopleFailure(error: any) {
    return {
        type: GET_PEOPLE_FAILURE,
        payload: error,
    };
}
