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
import { GenerateListDetail } from '../../interfaces/listsInterfaces';

export const POST_DAYS_STARTED = 'POST_DAYS_STARTED';
export const POST_DAYS_SUCCESSFUL = 'POST_DAYS_SUCCESSFUL';
export const POST_DAYS_FAILURE = 'POST_DAYS_FAILURE';
export const POST_PEOPLE_STARTED = 'POST_PEOPLE_STARTED';
export const POST_PEOPLE_SUCCESSFUL = 'POST_PEOPLE_SUCCESSFUL';
export const POST_PEOPLE_FAILURE = 'POST_PEOPLE_FAILURE';
export const REMOVE_PEOPLE_STARTED = 'REMOVE_PEOPLE_STARTED';
export const REMOVE_PEOPLE_SUCCESSFUL = 'REMOVE_PEOPLE_SUCCESSFUL';
export const REMOVE_PEOPLE_FAILURE = 'REMOVE_PEOPLE_FAILURE';
export const UPDATE_DAY_STARTED = 'UPDATE_DAY_STARTED';
export const UPDATE_DAY_SUCCESSFUL = 'UPDATE_DAY_SUCCESSFUL';
export const UPDATE_DAY_FAILURE = 'UPDATE_DAY_FAILURE';
export const GENERATE_LIST_STARTED = 'GENERATE_LIST_STARTED';
export const GENERATE_LIST_SUCCESSFUL = 'GENERATE_LIST_SUCCESSFUL';
export const GENERATE_LIST_FAILURE = 'GENERATE_LIST_FAILURE';

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
            console.log(error);
            dispatch(postPeopleFailure(error));
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

export function removePeople(removedPeople: Person[], newDate: string) {
    const request = apiHelper.apiCall(
        'DELETE',
        'People',
        removedPeople,
    );

    return (dispatch: Function) => {
        dispatch(removePeopleStarted());
        request
        .then((response: any) => {
            dispatch(removePeopleSuccessful(removedPeople));
            dispatch(getDay(newDate));
        })
        .catch((error: any) => {
            console.log(error);
            dispatch(removePeopleFailure(error));
        });
    };
}

function removePeopleStarted() {
    return {
        type: REMOVE_PEOPLE_STARTED,
    };
}

function removePeopleSuccessful(response: Person[]) {
    return {
        type: REMOVE_PEOPLE_SUCCESSFUL,
        payload: response,
    };
}

function removePeopleFailure(error: any) {
    return {
        type: REMOVE_PEOPLE_FAILURE,
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

export function generateList(newListDetails: GenerateListDetail) {
    const request = apiHelper.apiCall(
        'POST',
        'Lists/GenerateList',
        newListDetails,
      );
    
    return (dispatch: Function) => {
        dispatch(generateListStarted());
        request
        .then((response: number) => {
            dispatch(generateListSuccessful(response));
            // dispatch(getList(response));
            // dispatch(getListDetails(response));
        })
        .catch((error: any) => {
            console.log(error);
            dispatch(generateListFailure(error));
        });
    };
}

function generateListStarted() {
    return {
        type: GENERATE_LIST_STARTED,
    };
}

function generateListSuccessful(listid: number) {
    return {
        type: GENERATE_LIST_SUCCESSFUL,
        payload: listid,
    };
}

function generateListFailure(error: any) {
    return {
        type: GENERATE_LIST_FAILURE,
        payload: error,
    };
}
