import { Dispatch } from 'redux';

import { Meal } from './mealInterfaces';
import { Ingredient } from './ingredientInterfaces';

export interface MealDetail {
    mealingredientid: number;
    mealid: number; 
    ingredientid: number;
    amount: number;
}

export interface NewMealDetail {
    mealid: number; 
    ingredientid: number;
    amount: number;
}

export interface NewMealItem {
    uniqueKey: string;
    ingredient: string;
    amount: number;
    unit: string;
}

export interface MealDetailsProps {
    meals: Meal[];
    mealDetails: MealDetail[];
    ingredients: Ingredient[];
    updating: boolean;
    loading: boolean;
    dispatch: Dispatch<{}>;
    history: any;
    match: any;
}

export interface MealDetailsState {
    filterdMeal: Meal;
    filterdMealDetails: MealDetail[];
    mealid: number;
}

export interface MealEditProps {
    meals: Meal[];
    mealDetails: MealDetail[];
    ingredients: Ingredient[];
    updating: boolean;
    loading: boolean;
    dispatch: Dispatch<{}>;
    history: any;
    match: any;
}

export interface MealEditState {
    filterdMeal: Meal;
    filterdMealDetails: MealDetail[];
    updatedMealDetails: MealDetail[];
    deletedMealDetails: MealDetail[];
    newMealDetails: NewMealItem[];
    mealid: number;
    newDetailKey: number;
    ingredientList: string[];
    lastRowKey: string;
}
