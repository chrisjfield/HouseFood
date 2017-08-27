import { Person } from '../../interfaces/peopleInterfaces';
import { 
    GET_PEOPLE_STARTED,
    GET_PEOPLE_SUCCESSFUL,
    GET_PEOPLE_FAILURE,
} from '../../actions/people/peopleActions';
import { 
    POST_PEOPLE_STARTED,
    POST_PEOPLE_SUCCESSFUL,
    POST_PEOPLE_FAILURE,
} from '../../actions/planner/plannerActions';

interface peopleReducerState {
    people: Person[];
    loading: boolean;
    updating: boolean;
    error: boolean;
}

function peopleReducer(state: peopleReducerState = { 
    people: undefined, 
    loading: false,
    updating: false,
    error: false,
},                     action: any) {
    switch (action.type) {
    case GET_PEOPLE_STARTED:
        return {
            ...state,
            loading: true,
            error: false,
        };
    case GET_PEOPLE_SUCCESSFUL:
        return {
            ...state,
            people: action.payload,
            loading: false,
            error: false,
        };
    case GET_PEOPLE_FAILURE:
        return {
            ...state,
            loading: false,
            error: true,
        };
    case POST_PEOPLE_STARTED:
        return {
            ...state,
            loading: true,
            error: false,
        };
    case POST_PEOPLE_SUCCESSFUL:
        return {
            ...state,
            people: [...state.people, ...action.payload],
            loading: false,
            error: false,
        };
    case POST_PEOPLE_FAILURE:
        return {
            ...state,
            loading: false,
            error: true,
        };
    default:
        return state;
    }
}
  
export default peopleReducer;
