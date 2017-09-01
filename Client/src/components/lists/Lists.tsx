import * as React from 'react';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Moment from 'react-moment';

import { 
    List, 
    NewList,
} from '../../interfaces/listsInterfaces';
import { 
    getLists,
    completeList,
    editList,
    saveList, 
} from '../../actions/lists/listActions';

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
        const url: string = '/Lists/' + String(listId);
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
                    label="Add List"
                    primary={true}
                    onClick={this.openNewListDialog}
                />
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
        lists: store.listsReducer.lists,
        loading: store.listsReducer.loading,
        error: store.listsReducer.error,
        updating: store.listsReducer.updating,
    };
};
  
const ConnectedLists = connect(mapStateToProps)(Lists);
export default ConnectedLists;
