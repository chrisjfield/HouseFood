import { listReducerState } from '../../interfaces/stateInterfaces';
import { List } from '../../interfaces/listInterfaces';
import { 
    GET_LISTS_SUCCESSFUL,
    POST_LIST_SUCCESSFUL,
    PUT_LIST_SUCCESSFUL,
} from '../../actions/lists/listActions';

function listReducer(state: listReducerState = { 
    lists: undefined, 
},                   action: any) {
    switch (action.type) {
    case GET_LISTS_SUCCESSFUL:
        return {
            ...state,
            lists: action.payload,
        };
    case POST_LIST_SUCCESSFUL:
        return {
            ...state,
            lists: [...state.lists, action.payload],
        };
    case PUT_LIST_SUCCESSFUL:
        return {
            ...state,
            lists: [...state.lists.map((list: List) => list.listid === action.payload.listid ? action.payload : list)],
        };
    default:
        return state;
    }
}
  
export default listReducer;
