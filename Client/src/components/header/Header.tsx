import * as React from 'react';

import { Link } from 'react-router-dom';

import { 
    Toolbar, 
    ToolbarGroup, 
    ToolbarTitle, 
} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionShopping from 'material-ui/svg-icons/action/add-shopping-cart';

function Header() {
    return (
        <Toolbar>
            <ToolbarGroup>
                <Link to="/">
                    <IconButton tooltip="Home">
                        <ActionHome />
                    </IconButton>
                </Link>
                <ToolbarTitle text="House Food" />
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

export default Header;
        
