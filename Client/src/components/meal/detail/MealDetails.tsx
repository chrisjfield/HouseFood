import * as React from 'react';

import { connect } from 'react-redux';

import history from '../../../history';
import { AppLoading } from '../../loadingHandler';
import { NotFound404 } from '../../errorHandler';

import { Meal } from '../../../interfaces/mealInterfaces';
import { MealDetail, MealDetailsProps, MealDetailsState } from '../../../interfaces/mealDetailInterfaces';
import { Ingredient } from '../../../interfaces/ingredientInterfaces';
import { AppStore } from '../../../interfaces/stateInterfaces';

import { getMeals } from '../../../actions/meals/mealActions';
import { getMealDetails } from '../../../actions/mealDetails/mealDetailActions';
import { getIngredients } from '../../../actions/ingredient/ingredientActions';

import {
    Table, TableBody, TableHeader,
    TableHeaderColumn, TableRow, TableRowColumn,
} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';

import styles from '../../../styles';

class MealDetails extends React.Component<MealDetailsProps, MealDetailsState> {
    constructor(props: MealDetailsProps) {
        super();

        this.state = {
            filterdMeal: undefined,
            filterdMealDetails: [],
            mealid: undefined,
        };
    }

    componentWillMount() {
        this.props.dispatch(getMeals());
        this.props.dispatch(getMealDetails());
        this.props.dispatch(getIngredients());
    }

    componentWillReceiveProps(nextProps: MealDetailsProps) {
        const mealid: number =  Number(nextProps.match.params.mealid);
        const filterdMealDetails = nextProps.mealDetails 
            ? nextProps.mealDetails.filter((mealDetail: MealDetail) => mealDetail.mealid === mealid) 
            : []; 
        const filterdMeal: Meal = nextProps.meals 
            ? nextProps.meals.find((meal: Meal) => meal.mealid === mealid) 
            : undefined;
           
        this.setState({
            mealid,
            filterdMealDetails, 
            filterdMeal,
        });
    }

    checkMealDetailIsValid = () => {
        return (
            this.state.filterdMeal ? this.getMealDetails() : <NotFound404/>
        );
    }

    getMealDetails = () => {
        return (
            <div>
                <br/>
                <FlatButton label="Return to Meals" primary={true} onClick={this.goToMeals}/>
                <FlatButton label="Edit Meal" primary={true} onClick={this.editMeal}/>
                <h2 style={styles.editHeading}>{this.state.filterdMeal.name}</h2>
                {this.createTable()}
            </div>
        );
    }

    goToMeals = () => {
        const url: string = '/Meal/Header';
        history.push(url);
    }

    editMeal = () => {
        const url: string = '/Meal/Edit/' + String(this.state.mealid);
        history.push(url);
    }

    createTable() {
        return (
            <div>
                <Table>
                    {this.createTableHeader()}
                    <TableBody stripedRows={false} showRowHover={false} displayRowCheckbox={false}>
                        {this.getTableRows()}
                    </TableBody>
                </Table>
            </div>
        );
    }

    createTableHeader() {
        return (
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    <TableHeaderColumn style={styles.columnHeadings}>Item</TableHeaderColumn>
                    <TableHeaderColumn style={styles.columnHeadings}>Quantity</TableHeaderColumn>
                </TableRow>
            </TableHeader>
        );
    }

    getTableRows() {
        return this.state.filterdMealDetails
            .map((mealDetail: MealDetail) => this.createTableRows(mealDetail)); 
    }

    createTableRows(mealDetail: MealDetail) {
        const ingredient: Ingredient = this.props.ingredients
            .find((ingredient: Ingredient) => ingredient.ingredientid === mealDetail.ingredientid);

        return (
            ingredient
            ?   (
                <TableRow key={mealDetail.mealingredientid}>
                    <TableRowColumn>{ingredient.name}</TableRowColumn>
                    <TableRowColumn>{mealDetail.amount} {ingredient.units}</TableRowColumn>
                </TableRow>
            )
            : null
        );
    }

    render() {
        return (
            <div>
                {(!this.props.loading && this.props.ingredients && this.state 
                    && this.state.filterdMealDetails && this.state.mealid) 
                    ? this.checkMealDetailIsValid() 
                    : <AppLoading/>
                }
            </div>
        );
    }
}

const mapStateToProps = (store: AppStore) => {
    return {
        meals: store.mealReducer.meals,
        mealDetails: store.mealDetailReducer.mealDetails,
        ingredients: store.ingredientReducer.ingredients,
        loading: store.appReducer.getting > 0 ? true : false,
        updating: store.appReducer.putting > 0 ? true : false,
    };
};
  
const ConnectedMealDetails = connect(mapStateToProps)(MealDetails);
export default ConnectedMealDetails;
