import { List } from '../../interfaces/listsInterfaces';
import apiHelper from '../../helpers/apiHelper';

export const GET_LISTS_STARTED = 'GET_LISTS_STARTED';
export const GET_LISTS_SUCCESSFUL = 'GET_LISTS_SUCCESSFUL';
export const GET_LISTS_FAILURE = 'GET_LISTS_FAILURE';
export const COMPLETE_LISTS_STARTED = 'COMPLETE_LISTS_STARTED';
export const COMPLETE_LISTS_SUCCESSFUL = 'COMPLETE_LISTS_SUCCESSFUL';
export const COMPLETE_LISTS_FAILURE = 'COMPLETE_LISTS_FAILURE';

export function getLists() {
    const request = apiHelper.apiCall(
        'GET',
        'lists',
      );
    
    return (dispatch : Function) => {
        dispatch(getListsStarted());
        request
        .then((response : List[]) =>
          dispatch(getListsSuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getListsFailure(error));
        });
    };
}

function getListsStarted() {
    return {
        type: GET_LISTS_STARTED,
    };
}

function getListsSuccessful(response: List[]) {
    return {
        type: GET_LISTS_SUCCESSFUL,
        payload: response,
    };
}

function getListsFailure(error: any) {
    return {
        type: GET_LISTS_FAILURE,
        payload: error,
    };
}

export function completeList(list : List) {
    const endpoint = 'lists/' + String(list.listid);
    const date = new Date();
    const updatedList : List = JSON.parse(JSON.stringify(list));
    updatedList.complete = true;
    updatedList.datecompleted = date;
    const request = apiHelper.apiCall(
        'PUT',
        endpoint,
        updatedList,
      ); 
    
    return (dispatch : Function) => {
        dispatch(completeListsStarted());
        request
        .then((response : List[]) => {
            dispatch(completetListsSuccessful(response));
        })
        .catch((error : any) => {
            console.log(error);
            dispatch(completeListsFailure(error));
        });
    };
}

function completeListsStarted() {
    return {
        type: COMPLETE_LISTS_STARTED,
    };
}

function completetListsSuccessful(response: List[]) {
    return {
        type: COMPLETE_LISTS_SUCCESSFUL,
        payload: response,
    };
}

function completeListsFailure(error: any) {
    return {
        type: COMPLETE_LISTS_FAILURE,
        payload: error,
    };
}
