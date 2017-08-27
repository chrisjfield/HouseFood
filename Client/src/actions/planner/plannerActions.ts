import { 
    Day,
    NewDay, 
} from '../../interfaces/daysInterfaces';
import { 
    Person,
    NewPerson,
} from '../../interfaces/peopleInterfaces';
import apiHelper from '../../helpers/apiHelper';
import { getDay } from '../days/dayActions';

export const POST_DAYS_STARTED = 'POST_DAYS_STARTED';
export const POST_DAYS_SUCCESSFUL = 'POST_DAYS_SUCCESSFUL';
export const POST_DAYS_FAILURE = 'POST_DAYS_FAILURE';
export const POST_PEOPLE_STARTED = 'POST_PEOPLE_STARTED';
export const POST_PEOPLE_SUCCESSFUL = 'POST_PEOPLE_SUCCESSFUL';
export const POST_PEOPLE_FAILURE = 'POST_PEOPLE_FAILURE';
export const UPDATE_DAY_STARTED = 'UPDATE_DAY_STARTED';
export const UPDATE_DAY_SUCCESSFUL = 'UPDATE_DAY_SUCCESSFUL';
export const UPDATE_DAY_FAILURE = 'UPDATE_DAY_FAILURE';

export function addDay(newDay: NewDay, newPeople: NewPerson[]) {
    const request = apiHelper.apiCall(
        'POST',
        'Days',
        newDay,
    );
    
    return (dispatch : Function) => {
        dispatch(postDayStarted());
        request
        .then((response : Day[]) => {
            dispatch(postDateSuccessful(response));
            dispatch(addPeople(newPeople, newDay.date));
        })
        .catch((error : any) => {
            console.log(error);
            dispatch(postDayFailure(error));
        });
    };
}

function postDayStarted() {
    return {
        type: POST_DAYS_STARTED,
    };
}

function postDateSuccessful(response: Day[]) {
    return {
        type: POST_DAYS_SUCCESSFUL,
        payload: response,
    };
}

function postDayFailure(error: any) {
    return {
        type: POST_DAYS_FAILURE,
        payload: error,
    };
}

export function addPeople(newPeople: NewPerson[], newDate: string) {
    const request = apiHelper.apiCall(
        'POST',
        'People',
        newPeople,
    );

    return (dispatch: Function) => {
        dispatch(postPeopleStarted());
        request
        .then((response: Person[]) => {
            dispatch(postPeopleSuccessful(response));
            dispatch(getDay(newDate));
        })
        .catch((error: any) => {
            dispatch(postPeopleFailure(error));
            throw(error);
        });
    };
}

function postPeopleStarted() {
    return {
        type: POST_PEOPLE_STARTED,
    };
}

function postPeopleSuccessful(response: Person[]) {
    return {
        type: POST_PEOPLE_SUCCESSFUL,
        payload: response,
    };
}

function postPeopleFailure(error: any) {
    return {
        type: POST_PEOPLE_FAILURE,
        payload: error,
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
