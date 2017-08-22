import * as React from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { 
    Toolbar, 
    ToolbarGroup, 
    ToolbarTitle, 
} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionShopping from 'material-ui/svg-icons/action/add-shopping-cart';

interface HeaderProps {
    isLoggedIn: boolean;
    isOrganisation: boolean;
    isUser: boolean;
    dispatch: Dispatch<{}>;
}

class Header extends React.Component<HeaderProps> {
    constructor(props: any) {
        super();
    }

    render() {
        return (
            <Toolbar>
                <ToolbarGroup>
                    <Link to="/">
                        <IconButton tooltip="Home">
                            <ActionHome />
                        </IconButton>
                    </Link>
                    <ToolbarTitle text="Volunteer Portal" />
                </ToolbarGroup>
                <ToolbarGroup>
                    <Link to="/Lists">
                        <IconButton tooltip="Lists">
                            <ActionShopping />
                        </IconButton>
                    </Link>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

const mapStateToProps = (store: any, props: any) : any => {
    return undefined;
};
  
const ConnectedHeader = connect(mapStateToProps)(Header);
export default ConnectedHeader;
        
