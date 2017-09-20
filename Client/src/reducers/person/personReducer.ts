import { personReducerState } from '../../interfaces/stateInterfaces';
import { Person } from '../../interfaces/personInterfaces';

import { GET_PEOPLE_SUCCESSFUL, POST_PEOPLE_SUCCESSFUL, DELETE_PEOPLE_SUCCESSFUL } from '../../actions/people/peopleActions';

function personReducer(state: personReducerState = { 
    people: undefined, 
},                     action: any) {
    switch (action.type) {
    case GET_PEOPLE_SUCCESSFUL:
        return {
            ...state,
            people: action.payload,
        };
    case POST_PEOPLE_SUCCESSFUL:
        return {
            ...state,
            people: [...state.people, ...action.payload],
        };
    case DELETE_PEOPLE_SUCCESSFUL:
        return {
            ...state,
            people: [...state.people.filter((person: Person) => action.payload.indexOf(person) === -1)],
        };
    default:
        return state;
    }
}
  
export default personReducer;
