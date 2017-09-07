import { listDetailReducerState } from '../../interfaces/stateInterfaces';
import { ListDetail } from '../../interfaces/listDetailInterfaces';
import { 
    GET_LISTDETAILS_SUCCESSFUL, PUT_LISTDETAILS_SUCCESSFUL,
    POST_BULK_LISTDETAILS_SUCCESSFUL, PUT_BULK_LISTDETAILS_SUCCESSFUL, DELETE_BULK_LISTDETAILS_SUCCESSFUL,
    CHECK_ALL_LISTDETAILS_SUCCESSFUL,
} from '../../actions/listDetail/listDetailActions';

function listDetailReducer(state: listDetailReducerState = { 
    listDetails: undefined, 
},                         action: any) {
    switch (action.type) {
    case GET_LISTDETAILS_SUCCESSFUL:
        return {
            ...state,
            listDetails: action.payload,
        };
    case PUT_LISTDETAILS_SUCCESSFUL:
        return {
            ...state,
            listDetails:  [...state.listDetails.map((listDetails: ListDetail) => 
                listDetails.listitemid === action.payload.listitemid ? action.payload : listDetails)],
        };
    case POST_BULK_LISTDETAILS_SUCCESSFUL:
        return {
            ...state,
            listDetails: [...state.listDetails, ...action.payload],
        };
    case PUT_BULK_LISTDETAILS_SUCCESSFUL:
        return {
            ...state,
            listDetails: [...state.listDetails
                .map((listDetails: ListDetail) => {
                    const wasUpdated: ListDetail = action.payload
                        .find((payload: ListDetail) => payload.listitemid === listDetails.listitemid);
                    return wasUpdated ? wasUpdated : listDetails;
                })],
        };
    case DELETE_BULK_LISTDETAILS_SUCCESSFUL:
        return {
            ...state,
            listDetails: [...state.listDetails
                .filter((listDetail: ListDetail) => {
                    const wasDeleted: ListDetail = action.payload
                        .find((payload: ListDetail) => payload.listitemid === listDetail.listitemid);
                    return wasDeleted ? false : true;
                })],
        };
    case CHECK_ALL_LISTDETAILS_SUCCESSFUL:
        return {
            ...state,
            listDetails:  [...state.listDetails.map((listDetails: ListDetail) => {
                const newListDetails: ListDetail = JSON.parse(JSON.stringify(listDetails));
                if (newListDetails.listid === action.payload) {
                    newListDetails.complete = action.checked;
                }
                return newListDetails;
            })],
        };
    default:
        return state;
    }
}
  
export default listDetailReducer;
