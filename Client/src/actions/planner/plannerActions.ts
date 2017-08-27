import { 
    Day,
    NewDay, 
} from '../../interfaces/daysInterfaces';
import { 
    Person,
    NewPerson,
} from '../../interfaces/peopleInterfaces';
import apiHelper from '../../helpers/apiHelper';
import { updateDay } from '../days/dayActions';

export const POST_DAYS_STARTED = 'POST_DAYS_STARTED';
export const POST_DAYS_SUCCESSFUL = 'POST_DAYS_SUCCESSFUL';
export const POST_DAYS_FAILURE = 'POST_DAYS_FAILURE';
export const POST_PEOPLE_STARTED = 'POST_PEOPLE_STARTED';
export const POST_PEOPLE_SUCCESSFUL = 'POST_PEOPLE_SUCCESSFUL';
export const POST_PEOPLE_FAILURE = 'POST_PEOPLE_FAILURE';

export function addDay(newDay: NewDay, newPeople: NewPerson[]) {
    const request = apiHelper.apiCall(
        'POST',
        'Days',
        newDay,
    );
    
    return (dispatch : Function) => {
        dispatch(postDayStarted());
        request
        .then((response : Day[]) => {
            dispatch(postDateSuccessful(response));
            dispatch(addPeople(newPeople, newDay));
        })
        .catch((error : any) => {
            console.log(error);
            dispatch(postDayFailure(error));
        });
    };
}

function postDayStarted() {
    return {
        type: POST_DAYS_STARTED,
    };
}

function postDateSuccessful(response: Day[]) {
    return {
        type: POST_DAYS_SUCCESSFUL,
        payload: response,
    };
}

function postDayFailure(error: any) {
    return {
        type: POST_DAYS_FAILURE,
        payload: error,
    };
}

function addPeople(newPeople: NewPerson[], newDay: NewDay) {
    const request = apiHelper.apiCall(
        'POST',
        'People',
        newPeople,
    );

    return (dispatch: Function) => {
        dispatch(postPeopleStarted());
        request
        .then((response: Person[]) => {
            dispatch(postPeopleSuccessful(response));
            dispatch(updateDay(newDay.date));
        })
        .catch((error: any) => {
            dispatch(postPeopleFailure(error));
            throw(error);
        });
    };
}

function postPeopleStarted() {
    return {
        type: POST_PEOPLE_STARTED,
    };
}

function postPeopleSuccessful(response: Person[]) {
    return {
        type: POST_PEOPLE_SUCCESSFUL,
        payload: response,
    };
}

function postPeopleFailure(error: any) {
    return {
        type: POST_PEOPLE_FAILURE,
        payload: error,
    };
}

// export function saveDay(day: Day, people: Person[]) {
//     const request = apiHelper.apiCall(
//         'GET',
//         'Days',
//       );
    
//     return (dispatch : Function) => {
//         dispatch(getDaysStarted());
//         request
//         .then((response : Day[]) =>
//           dispatch(getDaysSuccessful(response)),
//         )
//         .catch((error : any) => {
//             console.log(error);
//             dispatch(getDaysFailure(error));
//         });
//     };
// }
