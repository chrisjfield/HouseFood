import * as React from 'react';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { List } from '../../../interfaces/listInterfaces';
import { ListDetail } from '../../../interfaces/listDetailInterfaces';
import { Ingredient } from '../../../interfaces/ingredientInterfaces';

import { 
    getLists,
    completeList, 
} from '../../../actions/lists/listActions';
import { 
    getListDetails,
    checkListDetail,
    checkAllListDetail,
} from '../../../actions/listDetail/listDetailActions';
import { getIngredients } from '../../../actions/ingredient/ingredientActions';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

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
    filterdList: List;
    filterdListDetails: ListDetail[];
    listid: number;
    allChecked: boolean;
    listComplete: boolean;
    alreadyAllChecked: boolean;
    completeDialogOpen: boolean;
}

class ListDetails extends React.Component<ListDetailsProps, ListDetailsState> {
    constructor(props: any) {
        super();

        this.state = {
            filterdList: undefined,
            filterdListDetails: [],
            listid: undefined,
            allChecked: false,
            listComplete: false,
            alreadyAllChecked: false,
            completeDialogOpen: false,
        };
    }

    componentWillMount() {
        this.props.dispatch(getLists());
        this.props.dispatch(getListDetails());
        this.props.dispatch(getIngredients());
    }

    componentWillReceiveProps(nextProps: ListDetailsProps) {
        const listid: number =  Number(nextProps.match.params.listid);
        const filterdListDetails = nextProps.listDetails 
            ? nextProps.listDetails.filter((listDetail: ListDetail) => listDetail.listid === listid) 
            : []; 
        const filterdList: List = nextProps.lists 
            ? nextProps.lists.find((list: List) => list.listid === listid) 
            : undefined; 
        const previousListDetails = this.props.listDetails 
            ? this.props.listDetails.filter((listDetail: ListDetail) => listDetail.listid === listid) 
            : []; 
            
        this.setState({
            listid,
            filterdListDetails, 
            filterdList,   
            listComplete: filterdList ? filterdList.complete : true,
            allChecked: filterdListDetails.every((listDetail: ListDetail) => listDetail.complete === true),   
            alreadyAllChecked: previousListDetails.every((listDetail: ListDetail) => listDetail.complete === true),
            completeDialogOpen: true,
        });
    }

    getTableRows() {
        return this.state.filterdListDetails
            .map((listDetail: ListDetail) => this.createTableRows(listDetail)); 

    }

    createTableRows(listDetail: ListDetail) {
        const ingredient: Ingredient = this.props.ingredients
            .find((ingredient: Ingredient) => ingredient.ingredientid === listDetail.ingredientid);
        return (
            ingredient
            ?   (
                <TableRow key={listDetail.listitemid}>
                    <TableRowColumn>
                        <Checkbox 
                            checked={listDetail.complete} 
                            onCheck={(event, isInputChecked) => this.handleCheck(isInputChecked, listDetail)}
                            disabled={this.state.listComplete}
                        />
                    </TableRowColumn>
                    <TableRowColumn>{ingredient.name}</TableRowColumn>
                    <TableRowColumn>{listDetail.amount} {ingredient.units}</TableRowColumn>
                    <TableRowColumn></TableRowColumn>
                </TableRow>
            )
            : null
            
        );
    }

    handleCheck(isInputChecked: boolean, listDetail: ListDetail) {
        this.props.dispatch(checkListDetail(listDetail));
    }

    handleCompleteDialogClose = () => {
        this.setState({ 
            completeDialogOpen: false,
        });
    }

    handleCompleteDialogComplete = () => {
        this.props.dispatch(completeList(this.state.filterdList));
        this.setState({ 
            completeDialogOpen: false,
        });
    }

    isCompleted() {
        const actions = [
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={this.handleCompleteDialogClose}
            />,
            <FlatButton
              label="Complete List"
              primary={true}
              keyboardFocused={true}
              onClick={this.handleCompleteDialogComplete}
            />,
        ];
        return (
            <Dialog
                title="Complete List"
                actions={actions}
                modal={false}
                open={this.state.completeDialogOpen}
                onRequestClose={this.handleCompleteDialogClose}
            >
                All items have been complete. 
                Would you like to mark {this.state.filterdList ? this.state.filterdList.name : ''} as complete?<br/>
                After this the list may only be viewed and not edited. 
            </Dialog>
        );
    }

    handleCheckAll(isInputChecked: boolean) {
        this.props.dispatch(checkAllListDetail(isInputChecked, this.state.listid)); 
    }

    createTableHeader() {
        return (
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    <TableHeaderColumn>
                        <Checkbox 
                            checked={this.state.allChecked} 
                            onCheck={(event, isInputChecked) => this.handleCheckAll(isInputChecked)}
                            disabled={this.state.listComplete}
                        />
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
                {(this.state.allChecked && !this.state.listComplete && !this.state.alreadyAllChecked) ? this.isCompleted() : null}
            </div>
        );
    }

    editList = () => {
        const url: string = '/List/Edit/' + String(this.state.listid);
        this.props.history.push(url);
    }

    render() {
        return (
            <div>
                <br/>
                {this.state && !this.state.listComplete 
                ? (
                    <FlatButton
                        label="Edit List"
                        primary={true}
                        onClick={this.state.listid ? this.editList : undefined}
                    />)
                : null
                }
                <br/>
                {(this.state && this.state.filterdListDetails && this.props.ingredients)
                ? this.createTable()
                : null}
            </div>
        );
    }
}

const mapStateToProps = (store : any, props : any) => {
    return {
        lists: store.listReducer.lists,
        listDetails: store.listDetailReducer.listDetails,
        ingredients: store.ingredientReducer.ingredients,
    };
};
  
const ConnectedListDetails = connect(mapStateToProps)(ListDetails);
export default ConnectedListDetails;
