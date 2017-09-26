import { 
    ListDetail,
    NewListDetail, 
} from '../../interfaces/listDetailInterfaces';
import apiHelper from '../../helpers/apiHelper';

import { 
    startGet, stopGet, startPost, stopPost,
    startPut, stopPut, startDelete, stopDelete,
} from '../app/appLoadingActions';
import { addError } from '../app/appErrorActions';

export const GET_LISTDETAILS_SUCCESSFUL = 'GET_LISTDETAILS_SUCCESSFUL';
export const POST_BULK_LISTDETAILS_SUCCESSFUL = 'POST_BULK_LISTDETAILS_SUCCESSFUL';
export const PUT_LISTDETAILS_SUCCESSFUL = 'PUT_LISTDETAILS_SUCCESSFUL';
export const PUT_BULK_LISTDETAILS_SUCCESSFUL = 'PUT_BULK_LISTDETAILS_SUCCESSFUL';
export const CHECK_ALL_LISTDETAILS_SUCCESSFUL = 'CHECK_ALL_LISTDETAILS_SUCCESSFUL';
export const DELETE_BULK_LISTDETAILS_SUCCESSFUL = 'DELETE_BULK_LISTDETAILS_SUCCESSFUL';

export function getListDetails() {
    const request = apiHelper.apiCall(
        'GET',
        'listitems',
      );
    
    return (dispatch: Function) => {
        dispatch(startGet());
        request
        .then((response: ListDetail[]) => {
            dispatch(getListDetailsSuccessful(response));
            dispatch(stopGet());
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopGet());
        });
    };
}

function getListDetailsSuccessful(response: ListDetail[]) {
    return {
        type: GET_LISTDETAILS_SUCCESSFUL,
        payload: response,
    };
}

export function postBulkListDetails(listDetails: NewListDetail[]) {
    const request = apiHelper.apiCall(
        'POST',
        'Listitems/bulk',
        listDetails,
      );

    return (dispatch: Function) => {
        dispatch(startPost());
        return request
        .then((response: ListDetail[]) => {
            dispatch(postBulkListDetailsSuccessful(response));
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

function postBulkListDetailsSuccessful(response: ListDetail[]) {
    return {
        type: POST_BULK_LISTDETAILS_SUCCESSFUL,
        payload: response,
    };
}

export function checkListDetail(listDetail: ListDetail) {
    const endpoint = 'listitems/' + String(listDetail.listitemid);
    const updatedListDetail: ListDetail = JSON.parse(JSON.stringify(listDetail));
    updatedListDetail.complete = !updatedListDetail.complete;

    const request = apiHelper.apiCall(
        'PUT',
        endpoint,
        updatedListDetail,
      );

    return (dispatch: Function) => {
        dispatch(startPut());
        request
        .then((response: ListDetail) => {
            dispatch(checkListDetailSuccessful(response));
            dispatch(stopPut());
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopPut());
        });
    };
}

function checkListDetailSuccessful(response: ListDetail) {
    return {
        type: PUT_LISTDETAILS_SUCCESSFUL,
        payload: response,
    };
}

export function checkAllListDetail(checked: boolean, listid: number) {
    const endpoint = 'listitems/bulk/' + String(listid);
    const checkedToJSON: any = JSON.parse(String(checked));

    const request = apiHelper.apiCall(
        'PUT',
        endpoint,
        checkedToJSON,
      );

    return (dispatch: Function) => {
        dispatch(startPut());
        request
        .then((response: number) => {
            dispatch(checkAllListDetailSuccessful(checked, listid));
            dispatch(stopPut());
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopPut());
        });
    };
}

function checkAllListDetailSuccessful(checked: boolean, listid: number) {
    return {
        checked,
        type: CHECK_ALL_LISTDETAILS_SUCCESSFUL,
        payload: listid,
    };
}

export function putBulkListDetails(listDetails: ListDetail[]) {
    const request = apiHelper.apiCall(
        'PUT',
        'Listitems/bulk',
        listDetails,
      );

    return (dispatch: Function) => {
        dispatch(startPut());
        return request
        .then((response: ListDetail[]) => {
            dispatch(putBulkListDetailsSuccessful(response));
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

function putBulkListDetailsSuccessful(response: ListDetail[]) {
    return {
        type: PUT_BULK_LISTDETAILS_SUCCESSFUL,
        payload: response,
    };
}

export function deleteBulkListDetails(listDetails: ListDetail[]) {
    const request = apiHelper.apiCall(
        'DELETE',
        'Listitems/bulk',
        listDetails,
      );

    return (dispatch: Function) => {
        dispatch(startDelete());
        return request
        .then((response: any) => {
            dispatch(deleteBulkListDetailsSuccessful(listDetails));
            dispatch(stopDelete());
            return response;
        })
        .catch((error: any) => {
            dispatch(addError(error));
            dispatch(stopDelete());
            throw error;
        });
    };
}

function deleteBulkListDetailsSuccessful(response: ListDetail[]) {
    return {
        type: DELETE_BULK_LISTDETAILS_SUCCESSFUL,
        payload: response,
    };
}

export function updateList(newListDetail: NewListDetail[], deletedListDetail: ListDetail[], updatedListDetail: ListDetail[]) {
    return (dispatch: Function) => {
        return Promise.all([
            dispatch(postBulkListDetails(newListDetail)),
            dispatch(deleteBulkListDetails(deletedListDetail)),
            dispatch(putBulkListDetails(updatedListDetail)),
        ]);
    };
}
