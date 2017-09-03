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
import MapsRestaurant from 'material-ui/svg-icons/maps/restaurant';
import ActionEvent from 'material-ui/svg-icons/action/event';

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
                <Link to="/Planner">
                    <IconButton tooltip="Planner">
                        <ActionEvent />
                    </IconButton>
                </Link>
                <Link to="/Meals">
                    <IconButton tooltip="Meals">
                        <MapsRestaurant />
                    </IconButton>
                </Link>
                <Link to="/List/Header">
                    <IconButton tooltip="Lists">
                        <ActionShopping />
                    </IconButton>
                </Link>
            </ToolbarGroup>
        </Toolbar>
    );
}

export default Header;
        
