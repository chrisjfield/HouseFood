class validationHelper {
    static validateIngredientAmount = (amount: number) => {
        let validationMessage: string = null;
        if (!amount) {
            validationMessage = 'Please set a quantity';
        } else if (amount < 0) {
            validationMessage = 'Amount must be positive';
        } else if (amount > 1000000) {
            validationMessage = 'Amount must be less than 1 million';
        }

        return validationMessage;
    }

    static validateIngredientName = (name: string) => {
        let validationMessage: string = null;
        if (!name) {
            validationMessage = 'Please choose an ingredient';
        } else if (name.length > 200) {
            validationMessage = 'Maximum name legth is 200 characters';
        }

        return validationMessage;
    }

    static validateIngredientUnit = (unit: string) => {
        let validationMessage: string = null;
        if (!unit) {
            validationMessage = 'Please set a unit';
        } else if (unit.length > 20) {
            validationMessage = 'Maximum unit legth is 10 characters';
        }
        
        return validationMessage;
    }

    static validateListName = (name: string) => {
        let validationMessage: string = undefined;
        if (!name) {
            validationMessage = 'Please choose a name for the list.';
        } else if (name.length > 200) {
            validationMessage = 'Maximum name legth is 200 characters';
        }

        return validationMessage;
    }

    static validateListStart = (start: Date) => {
        let validationMessage: string = undefined;
        if (!start) {
            validationMessage = 'Please choose a start date.';
        }

        return validationMessage;
    }

    static validateListEnd = (end: Date) => {
        let validationMessage: string = undefined;
        if (!end) {
            validationMessage = 'Please choose an end date.';
        }

        return validationMessage;
    }

    static validateMealName = (name: string) => {
        let validationMessage: string = undefined;
        if (!name) {
            validationMessage = 'Please choose a name for the meal.';
        } else if (name.length > 200) {
            validationMessage = 'Maximum name legth is 200 characters';
        }

        return validationMessage;
    }

    static validateMealCategory = (category: string) => {
        let validationMessage: string = undefined;
        if (!category) {
            validationMessage = 'Please choose a category for the meal.';
        } else if (category.length > 200) {
            validationMessage = 'Maximum category legth is 20 characters';
        }

        return validationMessage;
    }

    static validateMeal = (mealName: string, mealid: number) => {
        let validationMessage: string = undefined;
        if (!mealName) {
            validationMessage = 'Please choose a meal.';
        } else if (!mealid) {
            validationMessage = 'Meal is invalid - please select a valid meal.';
        }

        return validationMessage;
    }
}
  
export default validationHelper;
