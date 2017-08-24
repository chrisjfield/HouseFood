import * as React from 'react';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Moment from 'react-moment';

import { List } from '../../interfaces/listsInterfaces';
import { 
    getLists,
    completeList, 
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

    handleCompleteDialogClose = () => {
        this.setState({ 
            completeDialogOpen: false,
            activeList : undefined, 
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
              onClick={this.handleCompleteDialogClose}
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
                        onRequestClose={this.handleCompleteDialogClose}
                    >
                        Continuing will mark {this.state.activeList ? this.state.activeList.name : ''} as completed.<br/>
                        After this the list may only be viewed and not edited. 
                    </Dialog>
                </CardActions>
            </Card>
        );
    }

    createLists = () => {
        return this.props.lists ? this.props.lists
            .filter((list: List) => this.state.showComplete || list.complete === false)
            .sort((a,b) => {return (a.datecreated > b.datecreated) ? 1 : ((b.datecreated > a.datecreated) ? -1 : 0);})
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
                <div style={styles.toggle}>
                <Toggle 
                    label="Show Completed"
                    labelPosition="right"
                    toggled={this.state.showComplete} 
                    onToggle={(event, isInputChecked) => this.setToggle(isInputChecked)}
                />
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
