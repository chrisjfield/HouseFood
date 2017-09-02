export interface MealDetail {
    mealingredientid: number;
    mealid: number; 
    ingredientid: number;
    amount: number;
}

export interface NewMealDetail {
    uniqueKey: string;
    ingredient: string;
    amount: number;
    unit: string;
}
