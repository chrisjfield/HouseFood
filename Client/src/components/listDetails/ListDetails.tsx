import * as React from 'react';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { List } from '../../interfaces/listsInterfaces';
import { ListDetail } from '../../interfaces/listDetailInterfaces';
import { Ingredient } from '../../interfaces/ingredientInterfaces';
import { getLists } from '../../actions/lists/listActions';
import { 
    getListDetails,
    checkListDetail,
} from '../../actions/listDetail/listDetailActions';
import { getIngredients } from '../../actions/ingredient/ingredientActions';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';

interface ListDetailsProps {
    lists: List[];
    listDetails: ListDetail[];
    ingredients: Ingredient[];
    updating: boolean;
    dispatch: Dispatch<{}>;
    history: any;
    match: any;
}

interface ListDetailsState {
}

class ListDetails extends React.Component<ListDetailsProps, ListDetailsState> {
    constructor(props: any) {
        super();
    }

    componentWillMount() {
        this.props.dispatch(getLists());
        this.props.dispatch(getListDetails());
        this.props.dispatch(getIngredients());
    }
 
    getTableRows() {
        const listid: number = Number(this.props.match.params.listid);
        return this.props.listDetails
            .filter((listDetail: ListDetail) => listDetail.listid === listid)
            .map((listDetail: ListDetail) => this.createTableRows(listDetail)); 

    }

    createTableRows(listDetail: ListDetail) {
        const ingredient: Ingredient = this.props.ingredients
            .find((ingredient: Ingredient) => ingredient.ingredientid === listDetail.ingredientid);
        return (
            <TableRow key={listDetail.listitemid}>
                <TableRowColumn>
                    <Checkbox 
                        checked={listDetail.complete} 
                        onCheck={(event, isInputChecked) => this.handleCheck(isInputChecked, listDetail)}
                    />
                </TableRowColumn>
                <TableRowColumn>{ingredient.name}</TableRowColumn>
                <TableRowColumn>{listDetail.amount} {ingredient.units}</TableRowColumn>
                <TableRowColumn></TableRowColumn>
            </TableRow>
        );
    }

    handleCheck(isInputChecked: boolean, listDetail: ListDetail) {
        this.props.dispatch(checkListDetail(listDetail));
    }

    handleCheckAll(isInputChecked: boolean) {
        console.log(isInputChecked);
    }

    createTableHeader() {
        const listid: number = Number(this.props.match.params.listid);
        const allChecked: boolean = this.props.listDetails
            .filter((listDetail: ListDetail) => listDetail.listid === listid)
            .every((listDetail: ListDetail) => listDetail.complete === true);
        return (
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    <TableHeaderColumn>
                        <Checkbox checked={allChecked} onCheck={(event, isInputChecked) => this.handleCheckAll(isInputChecked)}/>
                    </TableHeaderColumn>
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
            (this.props.lists && this.props.listDetails && this.props.ingredients)
            ? this.createTable()
            : null
        );
    }
}

const mapStateToProps = (store : any, props : any) => {
    return {
        lists: store.listsReducer.lists,
        listDetails: store.listDetailsReducer.listDetails,
        ingredients: store.ingredientsReducer.ingredients,
    };
};
  
const ConnectedListDetails = connect(mapStateToProps)(ListDetails);
export default ConnectedListDetails;
