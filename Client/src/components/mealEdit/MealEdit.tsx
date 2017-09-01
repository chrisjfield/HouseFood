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
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

interface MealEditProps {
    mealDetails: MealDetail[];
    ingredients: Ingredient[];
    updating: boolean;
    dispatch: Dispatch<{}>;
    history: any;
    match: any;
}

interface MealEditState {
    filterdMealDetails: MealDetail[];
    updatedMealDetails: MealDetail[];
    mealid: number;
}

class MealEdit extends React.Component<MealEditProps, MealEditState> {
    constructor(props: any) {
        super();

        this.state = {
            filterdMealDetails: [],
            updatedMealDetails: [],
            mealid: undefined,
        };
    }

    componentWillMount() {
        this.props.dispatch(getMealDetails());
        this.props.dispatch(getIngredients());
    }

    componentWillReceiveProps(nextProps: MealEditProps) {
        const mealid: number =  Number(nextProps.match.params.mealid);
        const filterdMealDetails: MealDetail[] = nextProps.mealDetails 
            ? nextProps.mealDetails.filter((mealDetail: MealDetail) => mealDetail.mealid === mealid) 
            : []; 
        const updatedMealDetails: MealDetail[] = (this.state && this.state.updatedMealDetails.length !== 0)
            ? this.state.updatedMealDetails
            : [...filterdMealDetails];

        this.setState({
            mealid,
            filterdMealDetails, 
            updatedMealDetails,
        });
    }

    getTableRows() {
        return this.state.updatedMealDetails
            .map((mealDetail: MealDetail) => this.createTableRows(mealDetail)); 

    }

    createTableRows(mealDetail: MealDetail) {
        const ingredient: Ingredient = this.props.ingredients
            .find((ingredient: Ingredient) => ingredient.ingredientid === mealDetail.ingredientid);
        return (
            <TableRow key={mealDetail.mealingredientid}>
                <TableRowColumn>{ingredient.name}</TableRowColumn>
                <TableRowColumn>
                    <TextField
                        defaultValue={mealDetail.amount}
                        hintText="Quantity"
                        onChange={(event: object, newValue: string) => this.editExistingItemQuantity(mealDetail.mealingredientid, newValue)}
                        type="number"
                    />
                </TableRowColumn>
                <TableRowColumn>{ingredient.units}</TableRowColumn>
            </TableRow>
        );
    }

    editExistingItemQuantity = (mealingredientid: number, newValue: string) => {
        this.setState({
            updatedMealDetails: [...this.state.updatedMealDetails
                .map((mealDetail: MealDetail) => { 
                    return mealDetail.mealingredientid === mealingredientid 
                    ? { ...mealDetail, amount: Number(newValue) }
                    : mealDetail;
                },
            )],
        });
    }

    createTableHeader() {
        return (
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    <TableHeaderColumn>Item</TableHeaderColumn>
                    <TableHeaderColumn>Quantity</TableHeaderColumn>
                    <TableHeaderColumn>Units</TableHeaderColumn>
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

    saveMeal = () => {

    }

    render() {
        return (
            <div>
                <br/>
                <FlatButton
                    label="Save"
                    primary={true}
                    onClick={this.state.mealid ? this.saveMeal : undefined}
                />
                <br/>
                {(this.state && this.state.updatedMealDetails && this.props.ingredients)
                ? this.createTable()
                : null}
            </div>
        );
    }
}

const mapStateToProps = (store : any, props : any) => {
    return {
        mealDetails: store.mealDetailsReducer.mealDetails,
        ingredients: store.ingredientsReducer.ingredients,
    };
};
  
const ConnectedMealEdit = connect(mapStateToProps)(MealEdit);
export default ConnectedMealEdit;
