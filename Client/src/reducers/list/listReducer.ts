import { List } from '../../interfaces/listInterfaces';
import { 
    GET_LISTS_STARTED,
    GET_LISTS_SUCCESSFUL,
    GET_LISTS_FAILURE,
    COMPLETE_LISTS_STARTED,
    COMPLETE_LISTS_SUCCESSFUL,
    COMPLETE_LISTS_FAILURE,
    SAVE_LIST_SUCCESSFUL,
    EDIT_LIST_SUCCESSFUL,
} from '../../actions/lists/listActions';
import { 
    GENERATE_LIST_STARTED,
    GENERATE_LIST_SUCCESSFUL,
    GENERATE_LIST_FAILURE,
} from '../../actions/planner/plannerActions';
interface listsReducerState {
    lists: List[];
    loading: boolean;
    updating: boolean;
    error: boolean;
}

function listReducer(state: listsReducerState = { 
    lists: undefined, 
    loading: false,
    updating: false,
    error: false,
},                   action: any) {
    switch (action.type) {
    case GET_LISTS_STARTED:
        return {
            ...state,
            loading: true,
            error: false,
        };
    case GET_LISTS_SUCCESSFUL:
        return {
            ...state,
            lists: action.payload,
            loading: false,
            error: false,
        };
    case GET_LISTS_FAILURE:
        return {
            ...state,
            loading: false,
            error: true,
        };
    case COMPLETE_LISTS_STARTED:
        return {
            ...state,
            updating: true,
            error: false,
        };
    case COMPLETE_LISTS_SUCCESSFUL:
        return {
            ...state,
            lists: state.lists.map((list: List) => list.listid === action.payload.listid ? action.payload : list),
            updating: false,
            error: false,
        };
    case COMPLETE_LISTS_FAILURE:
        return {
            ...state,
            updating: false,
            error: true,
        };
    case GENERATE_LIST_STARTED:
        return {
            ...state,
            loading: true,
            error: false,
        };
    case GENERATE_LIST_SUCCESSFUL:
        return {
            ...state,
            lists: [...state.lists, ...action.payload],
            loading: false,
            error: false,
        };
    case GENERATE_LIST_FAILURE:
        return {
            ...state,
            loading: false,
            error: true,
        };
    case SAVE_LIST_SUCCESSFUL:
        return {
            ...state,
            lists: [...state.lists, action.payload],
            loading: false,
            error: false,
        };
    case EDIT_LIST_SUCCESSFUL:
        return {
            ...state,
            lists: [...state.lists.map((list: List) => list.listid === action.payload.listid ? action.payload : list)],
            loading: false,
            error: false,
        };
    default:
        return state;
    }
}
  
export default listReducer;
