import apiHelper from '../../helpers/apiHelper';

import { List, GenerateListDetail } from '../../interfaces/listInterfaces';

import { getListDetails } from '../../actions/listDetail/listDetailActions';
import { startPost, stopPost } from '../app/appLoadingActions';
import { addError } from '../app/appErrorActions';
import { POST_LIST_SUCCESSFUL } from '../../actions/lists/listActions';

export function generateList(newListDetails: GenerateListDetail) {
    const request = apiHelper.apiCall(
        'POST',
        'Lists/GenerateList',
        newListDetails,
      );
    
    return (dispatch: Function) => {
        dispatch(startPost());
        return request
        .then((response: List) => {
            dispatch(generateListSuccessful(response));
            dispatch(getListDetails());
            dispatch(stopPost());
            return response;
        })
        .catch((error: Error) => {
            dispatch(addError(error));
            dispatch(stopPost());
            throw(error);
        });
    };
}

function generateListSuccessful(list: List) {
    return {
        type: POST_LIST_SUCCESSFUL,
        payload: list,
    };
}
