import * as React from 'react';

import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { List } from '../../interfaces/listsInterfaces';
import { getShoppingLists } from '../../actions/lists/listActions';

interface ListsProps {
    shoppingList: List[];
    dispatch: Dispatch<{}>;
    history: any;
}

class Lists extends React.Component<ListsProps, any> {
    constructor(props: any) {
        super();

        this.state = {
            bookmarked: false,
        };
    }

    componentWillMount() {
        this.props.dispatch(getShoppingLists());
    }

    render() {
        console.log(this.props);
        return (
            <div>
                <h1>These are not the Lists you're looking for</h1>
            </div>
        );
    }
}

const mapStateToProps = (store : any, props : any) => {
    return {
        lists: store.listsReducer.lists,
    };
};
  
const ConnectedLists = connect(mapStateToProps)(Lists);
export default ConnectedLists;
