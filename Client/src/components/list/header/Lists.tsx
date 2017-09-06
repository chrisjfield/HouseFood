import * as React from 'react';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Moment from 'react-moment';
import * as moment from 'moment';

import { 
    List, 
    NewList,
    GenerateListDetail,
} from '../../../interfaces/listInterfaces';
import { 
    getLists,
    completeList,
    editList,
    saveList, 
} from '../../../actions/lists/listActions';
import { generateList } from '../../../actions/planner/plannerActions';

import {
    Card, 
    CardActions,  
    CardText,
    CardTitle,
} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import ActionView from 'material-ui/svg-icons/action/visibility';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import Edit from 'material-ui/svg-icons/editor/mode-edit';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

interface ListsProps {
    lists: List[];
    loading: boolean;
    error: boolean;
    updating: boolean;
    dispatch: Dispatch<{}>;
    history: any;
}

interface ListsState {
    activeList: List;
    completeDialogOpen: boolean;
    showComplete: boolean;
    newListDialogOpen: boolean;
    newList: NewList;
    editListDialogOpen: boolean;
    listEditing: List;
    nameErrorText: string;
    generateListDialogOpen: boolean;
    generateListDetail: GenerateListDetail;
    generateListDialogNameValidation: string;
    generateListDialogStartValidation: string;
    generateListDialogEndValidation: string;
}

const styles = {
    toggle: {
        maxWidth: 250,
        padding: '4px',
    },
};

class Lists extends React.Component<ListsProps, ListsState> {
    constructor(props: any) {
        super();

        this.state = {
            completeDialogOpen: false,
            activeList : undefined, 
            showComplete: false,
            newListDialogOpen: false,
            newList: undefined,
            editListDialogOpen: false,
            listEditing: undefined,
            nameErrorText: undefined,
            generateListDialogOpen: false,
            generateListDetail: undefined,
            generateListDialogNameValidation: undefined,
            generateListDialogStartValidation: undefined,
            generateListDialogEndValidation: undefined,
        };
    }

    componentWillMount() {
        this.props.dispatch(getLists());
    }
 
    handleCompleteDialogOpen = (list : List) => {
        this.setState({ 
            completeDialogOpen: true, 
            activeList : list,
        });
    }

    handleDialogClose = () => {
        this.setState({ 
            completeDialogOpen: false,
            activeList : undefined, 
            newListDialogOpen: false,            
            editListDialogOpen: false,
            listEditing: undefined,
            generateListDialogOpen: false,
            generateListDetail: undefined,
        });
    }

    handleCompleteDialogComplete = () => {
        this.props.dispatch(completeList(this.state.activeList));
        this.setState({ 
            completeDialogOpen: false,
            activeList : undefined, 
        });
    }

    handleViewDetails = (listId: number) => {
        const url: string = '/List/Detail/' + String(listId);
        this.props.history.push(url);
    }

    createlist = (list: List) => {
        const completed = list.complete ? 'Complete' : 'Active';
        const actions = [
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={this.handleDialogClose}
            />,
            <FlatButton
              label="Complete"
              primary={true}
              keyboardFocused={true}
              onClick={this.handleCompleteDialogComplete}
            />,
        ];
        
        return (
            <Card key={list.listid}>
                <CardTitle title={list.name + ' - ' + completed}/>} 
                <CardText>
                    <label>Created Date: </label><Moment format="DD/MM/YYYY" date={list.datecreated}/><br/>
                    <label>Completed Date: </label>
                    {list.datecompleted ? <Moment format="DD/MM/YYYY" date={list.datecompleted}/> : undefined}
                </CardText>
                <CardActions>
                    <IconButton 
                        tooltip="View Details" 
                        onClick={() => this.handleViewDetails(list.listid)}
                    >
                        <ActionView/>
                    </IconButton>
                    <IconButton 
                        tooltip="Edit" 
                        disabled={list.complete}
                        onClick={() => this.handleEdit(list.listid)}
                    >
                        <Edit/>
                    </IconButton> 
                    <IconButton 
                        tooltip="Complete" 
                        disabled={list.complete}
                        onClick={() => this.handleCompleteDialogOpen(list)}
                    >
                        <ActionDone/>
                    </IconButton>
                    <Dialog
                        title="Complete List"
                        actions={actions}
                        modal={true}
                        open={this.state.completeDialogOpen}
                        onRequestClose={this.handleDialogClose}
                    >
                        Continuing will mark {this.state.activeList ? this.state.activeList.name : ''} as completed.<br/>
                        After this the list may only be viewed and not edited. 
                    </Dialog>
                </CardActions>
            </Card>
        );
    }

    openNewListDialog = () => {
        this.setState({
            newListDialogOpen: true,
            newList: {
                name: null,
                datecreated: new Date(),
                complete: false,
            },
        });
    }

    handleEdit = (listid: number) => {
        this.setState({
            editListDialogOpen: true,
            listEditing: this.props.lists.find((List: List) => List.listid === listid),
        });
    }

    getNewListDialog = () => {
        return (
            <div>
                <Dialog
                    title="Create List"
                    open={this.state.newListDialogOpen}
                    onRequestClose={this.handleDialogClose}
                >
                    <form onSubmit={this.handleSaveNewList}>
                        <TextField
                            hintText="List Name"
                            errorText={this.state.nameErrorText}
                            onChange={(event: object, newValue: string) => this.editNewName(newValue)}
                        />
                        <FlatButton type="submit" label="Add" />
                        <FlatButton
                            label="Cancel"
                            primary={true}
                            onClick={this.handleDialogClose}
                        />
                    </form>
                </Dialog>
            </div>
        );
    }

    editNewName = (newValue: string) => {
        this.setState({ 
            newList: { 
                ...this.state.newList, 
                name: (newValue !== '') ? newValue : undefined,
            }, 
            nameErrorText: (newValue === '') ? 'Please enter a List name' : undefined, 
        });
    }

    handleSaveNewList = (event: any) => {
        event.preventDefault();
        if (!this.state.newList.name) {
            this.setState({ 
                nameErrorText: (!this.state.newList.name) ? 'Please enter a List name' : undefined, 
            });
        } else {
            this.props.dispatch(saveList(this.state.newList));
        }
    }

    getEditListDialog = () => {
        return (
            <div>
                <Dialog
                    title="Edit List"
                    open={this.state.editListDialogOpen}
                    onRequestClose={this.handleDialogClose}
                >
                    <form onSubmit={this.handleSaveEditedList}>
                        <TextField
                            hintText="List Name"
                            defaultValue={this.state.listEditing.name}
                            errorText={this.state.nameErrorText}
                            onChange={(event: object, newValue: string) => this.editEditedName(newValue)}
                        />
                        <FlatButton type="submit" label="Save" />
                        <FlatButton
                            label="Cancel"
                            primary={true}
                            onClick={this.handleDialogClose}
                        />
                    </form>
                </Dialog>
            </div>
        );        
    }

    editEditedName = (newValue: string) => {
        this.setState({ 
            listEditing: { 
                ...this.state.listEditing, 
                name: newValue,
            }, 
            nameErrorText: newValue ? undefined : 'Please enter a List name', 
        });
    }

    handleSaveEditedList = (event: any) => {
        event.preventDefault();
        if (!this.state.listEditing.name) {
            this.setState({ 
                nameErrorText: !this.state.listEditing.name ? 'Please enter a List name' : undefined, 
            });
        } else {
            this.props.dispatch(editList(this.state.listEditing));
            this.handleDialogClose();
        }
    }

    createLists = () => {
        return this.props.lists ? this.props.lists
            .filter((list: List) => this.state.showComplete || list.complete === false)
            .sort((a,b) => {return (a.datecreated < b.datecreated) ? 1 : ((b.datecreated < a.datecreated) ? -1 : 0);})
            .map(this.createlist) : undefined;
    }

    setToggle(isInputChecked: boolean) {
        this.setState({ 
            showComplete: isInputChecked, 
        });
    }

    getgenerateListDialog () {
        const actions = [
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={this.handleDialogClose}
            />,
            <FlatButton
              label="Generate List"
              primary={true}
              keyboardFocused={true}
              onClick={this.handleGenerateList}
            />,
        ];

        return (
            <div>
                <Dialog
                    title="Generate List"
                    actions={actions}
                    open={this.state.generateListDialogOpen}
                    onRequestClose={this.handleDialogClose}
                >
                Would you like to generate a shopping list for the following date range?
                    <div>
                        <br/>
                    </div>
                    <TextField
                        hintText="List Name"
                        defaultValue={this.state.generateListDetail.listName}
                        onChange={this.handleChangeListName}
                        errorText={this.state.generateListDialogNameValidation}
                    />
                    <div>
                        <br/>
                    </div>
                    <DatePicker 
                        hintText="Start Date" 
                        autoOk={true} 
                        defaultDate={this.state.generateListDetail.startDate}
                        onChange={this.handleChangeStartDate}
                        shouldDisableDate={this.disableDatesPastEnd}
                        errorText={this.state.generateListDialogStartValidation}
                    />
                    <div>
                        <br/>
                    </div>
                    <DatePicker 
                        hintText="End Date" 
                        autoOk={true} 
                        defaultDate={this.state.generateListDetail.endDate}
                        onChange={this.handleChangeEndDate}
                        shouldDisableDate={this.disableDatesBeforeStart}
                        errorText={this.state.generateListDialogEndValidation}
                    />
                </Dialog>
            </div>
        );
    }

    handleGenerateList = () => {
        const newList: GenerateListDetail = this.state.generateListDetail;
        if (!newList.endDate || !newList.listName || !newList.startDate) {
            this.setState({
                generateListDialogNameValidation: !newList.listName ? 'Please choose a list name' : undefined,
                generateListDialogStartValidation: !newList.startDate ? 'Please choose a start date' : undefined,
                generateListDialogEndValidation: !newList.endDate ? 'Please choose an end date' : undefined,
            });
        } else {
            this.props.dispatch(generateList(newList));
        }
    }

    disableDatesPastEnd = (date: Date) => {
        return date > this.state.generateListDetail.endDate;
    }

    disableDatesBeforeStart = (date: Date) => {
        return date < this.state.generateListDetail.startDate;
    }

    handleChangeListName = (event: object, newValue: string) => {
        this.setState({
            generateListDetail: { ...this.state.generateListDetail, listName: newValue },
            generateListDialogNameValidation: !newValue ? 'Please choose a list name' : undefined,
        });
    }

    handleChangeStartDate = (event: object, date: Date) => {
        this.setState({
            generateListDetail: { ...this.state.generateListDetail, startDate: date },
            generateListDialogStartValidation: !date ? 'Please choose a start date' : undefined,
        });
    }
    
    handleChangeEndDate = (event: object, date: Date) => {
        this.setState({
            generateListDetail: { ...this.state.generateListDetail, endDate: date },
            generateListDialogEndValidation: !date ? 'Please choose an end date' : undefined,
        });
    }

    openGenerateListDialog = () => {
        const date: Date = new Date();
        this.setState({
            generateListDialogOpen: true,
            generateListDetail: {
                startDate: date,
                endDate: moment(date).add(1, 'week').toDate(),
                listName: null,
            },
        });
    }

    render() {
        return (
            <div>
                <br/>
                <div style={styles.toggle}>
                <Toggle 
                    label="Show Completed"
                    labelPosition="right"
                    toggled={this.state.showComplete} 
                    onToggle={(event, isInputChecked) => this.setToggle(isInputChecked)}
                />
                <FlatButton
                    label="Add New List"
                    primary={true}
                    onClick={this.openNewListDialog}
                />
                <FlatButton
                    label="Generate List"
                    primary={true}
                    onClick={this.openGenerateListDialog}
                />
                {(this.state && this.state.generateListDialogOpen && this.state.generateListDetail)
                    ? this.getgenerateListDialog()
                    : null}
                {(this.state && this.state.editListDialogOpen && this.state.listEditing)
                    ? this.getEditListDialog()
                    : null}
                {(this.state && this.state.newListDialogOpen)
                    ? this.getNewListDialog()
                    : null}
                </div>
                {this.createLists()}
            </div>
        );
    }
}

const mapStateToProps = (store : any, props : any) => {
    return {
        lists: store.listReducer.lists,
        loading: store.listReducer.loading,
        error: store.listReducer.error,
        updating: store.listReducer.updating,
    };
};
  
const ConnectedLists = connect(mapStateToProps)(Lists);
export default ConnectedLists;
