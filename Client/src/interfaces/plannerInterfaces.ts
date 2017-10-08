import { Dispatch } from 'redux';

import { Day } from './dayInterfaces';
import { Meal } from './mealInterfaces';
import { Person } from './personInterfaces';

export interface PlannerProps {
    days: Day[];
    meals: Meal[];
    people: Person[];
    loading: boolean;
    updating: boolean;
    dispatch: Dispatch<{}>;
    history: History;
}

export interface PlannerState {
    calendarView: CalendarItem[];
    selectedDate: Date;
    selectedDayInfo: Day;
    selectedDayPeople: Person[];
    selectedSearchText: string;
    searchTerms: string[];
    searchPeople: string[];
    addPersonText: string;
    selectedPeopleSearchText: string;
    saveValidationMessage: string;
    generateListDialogOpen: boolean;
    generateListDialogStart: Date;
    generateListDialogEnd: Date;
    generateListDialogListName: string;
    generateListDialogValidationMessage: string;
    generateListDialogStartValidation: string;
    generateListDialogEndValidation: string;
}

export interface CalendarItem {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
}

export interface SlotInfo {
    action: string;
    end: Date;
    start: Date;
    slots: Date[];
}
