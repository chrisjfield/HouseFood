import * as React from 'react';

import { connect } from 'react-redux';
import Moment from 'react-moment';
import * as moment from 'moment';

import history from '../../../history';
import { AppStore } from '../../../interfaces/stateInterfaces';
import { AppLoading, AppUpdating } from '../../loadingHandler';

import textHelper from '../../../helpers/textHelper';
import validationHelper from '../../../helpers/validationHelper';
import dateHelper from '../../../helpers/dateHelper';

import { List, GenerateListDetail, ListsProps, ListsState } from '../../../interfaces/listInterfaces';
import { getLists, completeList, editList, saveList } from '../../../actions/lists/listActions';
import { generateList } from '../../../actions/planner/plannerActions';

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionDone from 'material-ui/svg-icons/action/done';
import ActionView from 'material-ui/svg-icons/action/visibility';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import Edit from 'material-ui/svg-icons/editor/mode-edit';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

import styles from '../../../styles';

class Lists extends React.Component<ListsProps, ListsState> {
    constructor(props: ListsProps) {
        super();

        this.state = {
            completeDialogOpen: false,
            activeList: undefined,
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

    getShoppingLists() {
        return (
            <div>
                <h3> Shopping Lists </h3>
                <div style={styles.toggle}>
                    <Toggle
                        label="Show Completed"
                        labelPosition="right"
                        toggled={this.state.showComplete}
                        onToggle={(event, isInputChecked) => this.setToggle(isInputChecked)}
                    />
                </div>
                <FlatButton label="Custom List" primary={true} onClick={this.openNewListDialog} />
                <FlatButton label="Auto Generate List" primary={true} onClick={this.openGenerateListDialog} />
                {this.state.generateListDialogOpen ? this.getgenerateListDialog() : null}
                {this.state.editListDialogOpen ? this.getEditListDialog() : null}
                {this.state.newListDialogOpen ? this.getNewListDialog() : null}
                {this.state.completeDialogOpen ? this.getCompleteListDialog() : null}
                {this.createLists()}
            </div>
        );
    }

    setToggle(isInputChecked: boolean) {
        this.setState({
            showComplete: isInputChecked,
        });
    }

    openNewListDialog = () => {
        this.setState({
            newListDialogOpen: true,
            newList: {
                name: '',
                datecreated: new Date(),
                complete: false,
            },
        });
    }

    openGenerateListDialog = () => {
        const date: Date = new Date();
        this.setState({
            generateListDialogOpen: true,
            generateListDetail: {
                startDate: date,
                endDate: moment(date).add(1, 'week').toDate(),
                listName: 'List for ' + moment(date).format('YYYY MM DD').toString(),
            },
        });
    }

    getgenerateListDialog() {
        const actions: JSX.Element[] = [
            <FlatButton label="Generate List" primary={true} onClick={this.handleGenerateList} />,
            <FlatButton label="Cancel" secondary={true} onClick={this.handleDialogClose} />,
        ];

        return (
            <div>
                <Dialog
                    title="Generate List"
                    actions={this.props.updating ? [<AppUpdating key="generating" />] : actions}
                    open={this.state.generateListDialogOpen}
                    onRequestClose={this.handleDialogClose}
                >
                    Make a shopping list for the following date range
                    <div>
                        <br />
                    </div>
                    <TextField
                        hintText="Weekly Shop"
                        floatingLabelText="List Name"
                        value={this.state.generateListDetail.listName}
                        onChange={this.handleChangeListName}
                        errorText={this.state.generateListDialogNameValidation}
                    />
                    <div>
                        <br />
                    </div>
                    <DatePicker
                        hintText="Start Date"
                        floatingLabelText="Start Date"
                        autoOk={true}
                        defaultDate={this.state.generateListDetail.startDate}
                        onChange={this.handleChangeStartDate}
                        shouldDisableDate={this.disableDatesPastEnd}
                        errorText={this.state.generateListDialogStartValidation}
                    />
                    <div>
                        <br />
                    </div>
                    <DatePicker
                        hintText="End Date"
                        floatingLabelText="End Date"
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

    handleDialogClose = () => {
        this.setState({
            completeDialogOpen: false,
            activeList: undefined,
            newListDialogOpen: false,
            editListDialogOpen: false,
            listEditing: undefined,
            generateListDialogOpen: false,
            generateListDetail: undefined,
            generateListDialogNameValidation: undefined,
            generateListDialogStartValidation: undefined,
            generateListDialogEndValidation: undefined,
            nameErrorText: undefined,
        });
    }

    handleGenerateList = () => {
        const newList = this.state.generateListDetail;

        if (this.validateList(newList)) {
            const formattedList = dateHelper.formatListDates(newList);

            this.props.dispatch(generateList(formattedList))
            .then((response: List) => {
                const url: string = '/List/Detail/' + String(response[0].listid);
                history.push(url);
            })
            .catch((error: Error) => {
                console.log(error);
            });
        }
    }

    validateList = (newList: GenerateListDetail) => {
        const isValid: boolean = (!this.validateListName(newList.listName) && !this.validateListStart(newList.startDate)
            && !this.validateListEnd(newList.endDate)) ? true : false;

        return isValid;
    }

    validateListName = (name: string) => {
        const validationMessage: string = validationHelper.validateListName(name);

        this.setState({
            generateListDialogNameValidation: validationMessage,
            nameErrorText: validationMessage,
        });

        return validationMessage;
    }

    validateListStart = (start: Date) => {
        const validationMessage: string = validationHelper.validateListStart(start);

        this.setState({ generateListDialogStartValidation: validationMessage });

        return validationMessage;
    }

    validateListEnd = (end: Date) => {
        const validationMessage: string = validationHelper.validateListEnd(end);

        this.setState({ generateListDialogEndValidation: validationMessage });

        return validationMessage;
    }

    handleChangeListName = (event: object, newValue: string) => {
        this.setState({
            generateListDetail: { ...this.state.generateListDetail, listName: textHelper.toTitleCase(newValue) },
        });
        this.validateListName(newValue);
    }

    handleChangeStartDate = (event: object, date: Date) => {
        this.setState({
            generateListDetail: { ...this.state.generateListDetail, startDate: date },
        });
        this.validateListStart(date);
    }

    disableDatesPastEnd = (date: Date) => {
        return date > this.state.generateListDetail.endDate;
    }

    handleChangeEndDate = (event: object, date: Date) => {
        this.setState({
            generateListDetail: { ...this.state.generateListDetail, endDate: date },
        });
        this.validateListEnd(date);
    }

    disableDatesBeforeStart = (date: Date) => {
        return date < this.state.generateListDetail.startDate;
    }

    getEditListDialog = () => {
        const actions: JSX.Element[] = [
            <FlatButton key="save" type="submit" label="Save" primary={true} />,
            <FlatButton key="cancel" label="Cancel" secondary={true} onClick={this.handleDialogClose} />,
        ];

        return (
            <div>
                <Dialog
                    title="Edit List"
                    open={this.state.editListDialogOpen}
                    onRequestClose={this.handleDialogClose}
                >
                    <form onSubmit={this.handleSaveEditedList}>
                        <TextField
                            hintText="Weekly Shop"
                            floatingLabelText="List Name"
                            value={this.state.listEditing.name}
                            errorText={this.state.nameErrorText}
                            onChange={(event: object, newValue: string) => this.editEditedName(newValue)}
                        />
                        {this.props.updating ? [<AppUpdating key="editing" />] : actions}
                    </form>
                </Dialog>
            </div>
        );
    }

    handleSaveEditedList = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!this.validateListName(this.state.listEditing.name)) {
            this.props.dispatch(editList(this.state.listEditing))
            .then((response: List) => {
                this.handleDialogClose();
            })
            .catch((error: Error) => {
                console.log(error);
            });
        }
    }

    editEditedName = (newValue: string) => {
        this.setState({
            listEditing: { ...this.state.listEditing, name: textHelper.toTitleCase(newValue) },
        });
        this.validateListName(newValue);
    }

    getNewListDialog = () => {
        const actions: JSX.Element[] = [
            <FlatButton key="add" type="submit" label="Add" primary={true} />,
            <FlatButton key="cancel" label="Cancel" secondary={true} onClick={this.handleDialogClose} />,
        ];

        return (
            <div>
                <Dialog
                    title="Create List"
                    open={this.state.newListDialogOpen}
                    onRequestClose={this.handleDialogClose}
                >
                    <form onSubmit={this.handleSaveNewList}>
                        <TextField
                            hintText="Weekly Shop"
                            floatingLabelText="List Name"
                            errorText={this.state.nameErrorText}
                            onChange={(event: object, newValue: string) => this.editNewName(newValue)}
                            value={this.state.newList.name}
                        />
                        {this.props.updating ? [<AppUpdating key="creating" />] : actions}
                    </form>
                </Dialog>
            </div>
        );
    }

    handleSaveNewList = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!this.validateListName(this.state.newList.name)) {
            this.props.dispatch(saveList(this.state.newList))
            .then((response: List) => {
                const url: string = '/List/Edit/' + String(response.listid);
                history.push(url);
            })
            .catch((error: Error) => {
                console.log(error);
            });
        }
    }

    editNewName = (newValue: string) => {
        this.setState({
            newList: { ...this.state.newList, name: textHelper.toTitleCase(newValue) },
        });
        this.validateListName(newValue);
    }

    getCompleteListDialog = () => {
        const actions = [
            <FlatButton key="cancel" label="Cancel" primary={true} onClick={this.handleDialogClose} />,
            <FlatButton key="complete" label="Complete" primary={true} keyboardFocused={true} onClick={this.handleComplete} />,
        ];

        return (
            <div>
                <Dialog
                    title="Complete List"
                    actions={this.props.updating ? [<AppUpdating key="completing" />] : actions}
                    open={this.state.completeDialogOpen}
                    onRequestClose={this.handleDialogClose}
                >
                    Continuing will mark {this.state.activeList ? this.state.activeList.name : ''} as completed.<br />
                    After this the list may only be viewed and not edited.
                </Dialog>
            </div>
        );
    }

    handleComplete = () => {
        this.props.dispatch(completeList(this.state.activeList))
            .then((response: List) => {
                this.setState({
                    completeDialogOpen: false,
                    activeList: undefined,
                });
            })
            .catch((error: Error) => {
                console.log(error);
            });
    }

    createLists = () => {
        return this.props.lists
            .filter((list: List) => this.state.showComplete || list.complete === false)
            .sort((a, b) => { return (a.datecreated < b.datecreated) ? 1 : ((b.datecreated < a.datecreated) ? -1 : 0); })
            .map(this.createlist);
    }

    createlist = (list: List) => {
        const completed = list.complete ? 'Complete' : 'Active';

        return (
            <Card key={list.listid}>
                <CardTitle title={list.name + ' - ' + completed} />}
                <CardText>
                    <label>Created Date: </label><Moment format="DD/MM/YYYY" date={list.datecreated} /><br />
                    <label>Completed Date: </label>
                    {list.datecompleted ? <Moment format="DD/MM/YYYY" date={list.datecompleted} /> : undefined}
                </CardText>
                <CardActions>
                    <IconButton tooltip="View Details" onClick={() => this.handleViewDetails(list.listid)}>
                        <ActionView />
                    </IconButton>
                    <IconButton tooltip="Edit" disabled={list.complete} onClick={() => this.handleEdit(list.listid)}>
                        <Edit />
                    </IconButton>
                    <IconButton tooltip="Complete" disabled={list.complete} onClick={() => this.handleCompleteDialogOpen(list)}>
                        <ActionDone />
                    </IconButton>
                </CardActions>
            </Card>
        );
    }

    handleViewDetails = (listId: number) => {
        const url: string = '/List/Detail/' + String(listId);
        history.push(url);
    }

    handleEdit = (listid: number) => {
        this.setState({
            editListDialogOpen: true,
            listEditing: this.props.lists.find((List: List) => List.listid === listid),
        });
    }

    handleCompleteDialogOpen = (list: List) => {
        this.setState({
            completeDialogOpen: true,
            activeList: list,
        });
    }

    render() {
        return (
            <div>
                {(!this.props.loading && this.state && this.props.lists)
                    ? this.getShoppingLists()
                    : <AppLoading />
                }
            </div>
        );
    }
}

const mapStateToProps = (store: AppStore) => {
    return {
        lists: store.listReducer.lists,
        loading: store.appReducer.getting > 0 ? true : false,
        updating: (store.appReducer.posting > 0 || store.appReducer.putting > 0 || store.appReducer.deleting > 0) ? true : false,
    };
};

const ConnectedLists = connect(mapStateToProps)(Lists);
export default ConnectedLists;
