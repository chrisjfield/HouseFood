import history from '../../history';

import { 
    List,
    NewList, 
} from '../../interfaces/listsInterfaces';
import apiHelper from '../../helpers/apiHelper';

export const GET_LISTS_STARTED = 'GET_LISTS_STARTED';
export const GET_LISTS_SUCCESSFUL = 'GET_LISTS_SUCCESSFUL';
export const GET_LISTS_FAILURE = 'GET_LISTS_FAILURE';
export const COMPLETE_LISTS_STARTED = 'COMPLETE_LISTS_STARTED';
export const COMPLETE_LISTS_SUCCESSFUL = 'COMPLETE_LISTS_SUCCESSFUL';
export const COMPLETE_LISTS_FAILURE = 'COMPLETE_LISTS_FAILURE';
export const SAVE_LIST_SUCCESSFUL = 'SAVE_LIST_SUCCESSFUL';
export const EDIT_LIST_SUCCESSFUL = 'EDIT_LIST_SUCCESSFUL';

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

export function saveList(meal: NewList) {
    const request = apiHelper.apiCall(
        'POST',
        'lists',
        meal,
      );
    
    return (dispatch : Function) => {
        dispatch(getListsStarted());
        request
        .then((response : List) => {
            const url: string = '/List/Edit/' + String(response.listid);
            dispatch(saveListSuccessful(response)),
            history.push(url);
        })
        .catch((error : any) => {
            console.log(error);
            dispatch(getListsFailure(error));
        });
    };
}

function saveListSuccessful(response: List) {
    return {
        type: SAVE_LIST_SUCCESSFUL,
        payload: response,
    };
}

export function editList(list: List) {
    const url: string = 'Lists/' + String(list.listid);
    const request = apiHelper.apiCall(
        'PUT',
        url,
        list,
      );
    
    return (dispatch : Function) => {
        dispatch(getListsStarted());
        request
        .then((response : List) => 
            dispatch(editListSuccessful(response)),
        )
        .catch((error : any) => {
            console.log(error);
            dispatch(getListsFailure(error));
        });
    };
}

function editListSuccessful(response: List) {
    return {
        type: EDIT_LIST_SUCCESSFUL,
        payload: response,
    };
}
