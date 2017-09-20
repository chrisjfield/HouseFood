import { 
    List,
    NewList, 
} from '../../interfaces/listInterfaces';
import apiHelper from '../../helpers/apiHelper';

import { 
    startGet, stopGet, startPost, stopPost,
    startPut, stopPut,
} from '../app/appLoadingActions';
import { addError } from '../app/appErrorActions';

export const GET_LISTS_SUCCESSFUL = 'GET_LISTS_SUCCESSFUL';
export const POST_LIST_SUCCESSFUL = 'POST_LIST_SUCCESSFUL';
export const PUT_LIST_SUCCESSFUL = 'PUT_LIST_SUCCESSFUL';

export function getLists() {
    const request = apiHelper.apiCall(
        'GET',
        'lists',
      );
    
    return (dispatch: Function) => {
        dispatch(startGet());
        request
        .then((response: List[]) => {
            dispatch(getListsSuccessful(response));
            dispatch(stopGet());
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopGet());
        });
    };
}

function getListsSuccessful(response: List[]) {
    return {
        type: GET_LISTS_SUCCESSFUL,
        payload: response,
    };
}

export function saveList(meal: NewList) {
    const request = apiHelper.apiCall(
        'POST',
        'lists',
        meal,
      );
    
    return (dispatch: Function) => {
        dispatch(startPost());
        return request
        .then((response: List) => {
            dispatch(saveListSuccessful(response));
            dispatch(stopPost());
            return response;
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopPost());
            throw(error);
        });
    };
}

function saveListSuccessful(response: List) {
    return {
        type: POST_LIST_SUCCESSFUL,
        payload: response,
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
    
    return (dispatch: Function) => {
        dispatch(startPut());
        request
        .then((response: List) => {
            dispatch(editListSuccessful(response));
            dispatch(stopPut());
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopPut());
        });
    };
}

export function editList(list: List) {
    const url: string = 'Lists/' + String(list.listid);
    const request = apiHelper.apiCall(
        'PUT',
        url,
        list,
      );
    
    return (dispatch: Function) => {
        dispatch(startPut());
        request
        .then((response: List) => {
            dispatch(editListSuccessful(response));
            dispatch(stopPut());
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopPut());
        });
    };
}

function editListSuccessful(response: List) {
    return {
        type: PUT_LIST_SUCCESSFUL,
        payload: response,
    };
}
