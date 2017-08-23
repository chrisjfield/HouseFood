import * as React from 'react';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { List } from '../../interfaces/listsInterfaces';
import { getLists } from '../../actions/lists/listActions';
import { getListDetails } from '../../actions/listDetail/listDetailActions';

interface ListDetailsProps {
    lists: List[];
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
    }
 
    render() {
        console.log(this.props);
        return (
            <div>
                <h1>hello {this.props.match.params.listid}</h1>
            </div>
        );
    }
}

const mapStateToProps = (store : any, props : any) => {
    return {
        lists: store.listsReducer.lists,
    };
};
  
const ConnectedListDetails = connect(mapStateToProps)(ListDetails);
export default ConnectedListDetails;
