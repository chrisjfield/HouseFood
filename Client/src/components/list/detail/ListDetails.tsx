import * as React from 'react';

import { connect } from 'react-redux';

import { AppLoading, AppUpdating } from '../../loadingHandler';
import { NotFound404 } from '../../errorHandler';

import { List } from '../../../interfaces/listInterfaces';
import { ListDetail, ListDetailsProps, ListDetailsState } from '../../../interfaces/listDetailInterfaces';
import { Ingredient } from '../../../interfaces/ingredientInterfaces';
import { AppStore } from '../../../interfaces/stateInterfaces';

import { getLists, completeList } from '../../../actions/lists/listActions';
import { getListDetails, checkListDetail, checkAllListDetail } from '../../../actions/listDetail/listDetailActions';
import { getIngredients } from '../../../actions/ingredient/ingredientActions';

import {
    Table, TableBody, TableHeader,
    TableHeaderColumn, TableRow, TableRowColumn,
  } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import styles from '../../../styles';

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
        const allChecked =  filterdListDetails.every((listDetail: ListDetail) => listDetail.complete === true);
        const alreadyAllChecked = previousListDetails.every((listDetail: ListDetail) => listDetail.complete === true);
        const listComplete = filterdList ? filterdList.complete : true;
        const completeDialogOpen = (allChecked && !listComplete && !alreadyAllChecked) ? true : this.state.completeDialogOpen;

        this.setState({
            listid,
            filterdListDetails, 
            filterdList,   
            allChecked,   
            alreadyAllChecked,
            completeDialogOpen,
            listComplete,
        });
    }

    checkListDetailIsValid = () => {
        return (
            this.state.filterdList ? this.getListDetails() : <NotFound404/>
        );
    }

    getListDetails = () => {
        return (
            <div>
                {!this.state.listComplete ? this.getCompleteList() : null}
                <h2 style={styles.editHeading}>{this.state.filterdList.name}</h2>
                {this.createTable()}
            </div>
        );
    }

    getCompleteList = () => {
        return (
            <FlatButton label="Edit List" primary={true} onClick={this.editList} />
        );
    }

    editList = () => {
        const url: string = '/List/Edit/' + String(this.state.listid);
        this.props.history.push(url);
    }

    createTable = () => {
        return (
            <div>
                <Table>
                    {this.createTableHeader()}
                    <TableBody stripedRows={true} showRowHover={true} displayRowCheckbox={false}>
                        {this.getTableRows()}
                    </TableBody>
                </Table>
                {(this.state.allChecked && !this.state.listComplete && !this.state.alreadyAllChecked) ? this.isCompleted() : null}
                {this.isCompleted()}
            </div>
        );
    }

    createTableHeader = () => {
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
                    <TableHeaderColumn style={styles.columnHeadings}>Item</TableHeaderColumn>
                    <TableHeaderColumn style={styles.columnHeadings}>Quantity</TableHeaderColumn>
                </TableRow>
            </TableHeader>
        );
    }

    handleCheckAll = (isInputChecked: boolean) => {
        this.props.dispatch(checkAllListDetail(isInputChecked, this.state.listid)); 
    }

    getTableRows = () => {
        return this.state.filterdListDetails
            .map((listDetail: ListDetail) => this.createTableRows(listDetail)); 
    }

    createTableRows = (listDetail: ListDetail) => {
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
                </TableRow>
            )
            : null 
        );
    }

    handleCheck = (isInputChecked: boolean, listDetail: ListDetail) => {
        this.props.dispatch(checkListDetail(listDetail));
    }

    isCompleted = () => {
        const actions: JSX.Element[] = [
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
                actions={this.props.updating ? [<AppUpdating/>] : actions}
                modal={true}
                open={this.state.completeDialogOpen}
                onRequestClose={this.handleCompleteDialogClose}
            >
                All items have been complete. 
                Would you like to mark {this.state.filterdList ? this.state.filterdList.name : ''} as complete?<br/>
                After this the list may only be viewed and not edited. 
            </Dialog>
        );
    }

    handleCompleteDialogClose = () => {
        this.setState({ 
            completeDialogOpen: false,
        });
    }

    handleCompleteDialogComplete = () => {
        this.props.dispatch(completeList(this.state.filterdList))
        .then((response: List) => {
            this.setState({ 
                completeDialogOpen: false,
            });
        })
        .catch((error: any) => {
            console.log(error);
        });
    }
  
    render() {
        return (
            <div>
                {(!this.props.loading && this.state && this.state.filterdListDetails 
                  && this.state.filterdListDetails && this.state.listid) 
                    ? this.checkListDetailIsValid() 
                    : <AppLoading/>
                }
            </div>
        );
    }
}

const mapStateToProps = (store: AppStore) => {
    return {
        lists: store.listReducer.lists,
        listDetails: store.listDetailReducer.listDetails,
        ingredients: store.ingredientReducer.ingredients,
        loading: store.appReducer.getting > 0 ? true : false,
        updating: store.appReducer.putting > 0 ? true : false,
    };
};
  
const ConnectedListDetails = connect(mapStateToProps)(ListDetails);
export default ConnectedListDetails;
