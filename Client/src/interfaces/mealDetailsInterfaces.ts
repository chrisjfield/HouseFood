export interface MealDetail {
    mealingredientid: number;
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

export interface NewMealDetail {
    mealid: number; 
    ingredientid: number;
    amount: number;
}
