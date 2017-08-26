import * as React from 'react';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { MealDetail } from '../../interfaces/mealDetailsInterfaces';
import { Ingredient } from '../../interfaces/ingredientInterfaces';

import { getMealDetails } from '../../actions/mealDetails/mealDetailActions';
import { getIngredients } from '../../actions/ingredient/ingredientActions';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';

interface MealDetailsProps {
    mealDetails: MealDetail[];
    ingredients: Ingredient[];
    updating: boolean;
    dispatch: Dispatch<{}>;
    history: any;
    match: any;
}

interface MealDetailsState {
    filterdMealDetails: MealDetail[];
    mealid: number;
}

class MealDetails extends React.Component<MealDetailsProps, MealDetailsState> {
    constructor(props: any) {
        super();

        this.state = {
            filterdMealDetails: [],
            mealid: undefined,
        };
    }

    componentWillMount() {
        this.props.dispatch(getMealDetails());
        this.props.dispatch(getIngredients());
    }

    componentWillReceiveProps(nextProps: MealDetailsProps) {
        const mealid: number =  Number(nextProps.match.params.mealid);
        const filterdMealDetails = nextProps.mealDetails 
            ? nextProps.mealDetails.filter((mealDetail: MealDetail) => mealDetail.mealid === mealid) 
            : []; 
           
        this.setState({
            mealid,
            filterdMealDetails, 
        });
    }

    getTableRows() {
        return this.state.filterdMealDetails
            .map((mealDetail: MealDetail) => this.createTableRows(mealDetail)); 

    }

    createTableRows(mealDetail: MealDetail) {
        const ingredient: Ingredient = this.props.ingredients
            .find((ingredient: Ingredient) => ingredient.ingredientid === mealDetail.ingredientid);
        return (
            <TableRow key={mealDetail.mealingredientid}>
                <TableRowColumn>{ingredient.name}</TableRowColumn>
                <TableRowColumn>{mealDetail.amount} {ingredient.units}</TableRowColumn>
                <TableRowColumn></TableRowColumn>
            </TableRow>
        );
    }

    createTableHeader() {
        return (
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    <TableHeaderColumn>Item</TableHeaderColumn>
                    <TableHeaderColumn>Quantity</TableHeaderColumn>
                    <TableHeaderColumn></TableHeaderColumn>
                </TableRow>
            </TableHeader>
        );
    }
    
    createTable() {
        return (
            <div>
                <Table>
                    {this.createTableHeader()}
                    <TableBody 
                        stripedRows={true} 
                        showRowHover={true} 
                        displayRowCheckbox={false}
                    >
                        {this.getTableRows()}
                    </TableBody>
                </Table>
            </div>
        );
    }

    render() {
        return (
            (this.state && this.state.filterdMealDetails && this.props.ingredients)
            ? this.createTable()
            : null
        );
    }
}

const mapStateToProps = (store : any, props : any) => {
    return {
        mealDetails: store.mealDetailsReducer.mealDetails,
        ingredients: store.ingredientsReducer.ingredients,
    };
};
  
const ConnectedMealDetails = connect(mapStateToProps)(MealDetails);
export default ConnectedMealDetails;
