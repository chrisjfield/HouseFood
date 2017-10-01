import { Dispatch } from 'redux';

import { Day } from './dayInterfaces';
import { Person } from './personInterfaces';
import { Meal } from './mealInterfaces';

export interface AppErrorProps {
    dispatch: Dispatch<{}>;
    errorMessage: string;
}

export interface HomeProps {
    days: Day[];
    people: Person[];
    meals: Meal[];
    loading: boolean;
    updating: boolean;
    dispatch: Dispatch<{}>;
}

export interface HomeState {
    selectedDate: Date;
    selectedSearchText: string;
    saveValidationMessage: string;
    searchTerms: string[];
    selectedDayPeople: Person[];
    addPersonText: string;
    selectedPeopleSearchText: string;
    searchPeople: string[];
}
