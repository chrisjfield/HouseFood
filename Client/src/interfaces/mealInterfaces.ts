import { Dispatch } from 'redux';

export interface Meal {
    mealid: number;
    name: string; 
    category: string;
}

export interface NewMeal {
    name: string; 
    category: string;
}

export interface MealsProps {
    meals: Meal[];
    loading: boolean;
    updating: boolean;
    dispatch: Dispatch<{}>;
    history: any;
}

export interface MealsState {
    categories: string[];
    searchTerms: string[];
    searchString: string;
    newMealDialogOpen: boolean;
    newMeal: NewMeal;
    editMealDialogOpen: boolean;
    mealEditing: Meal;
    nameErrorText: string;
    categoryErrorText: string;
}
