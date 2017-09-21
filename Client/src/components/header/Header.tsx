import * as React from 'react';

import { Link } from 'react-router-dom';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';

import Home from 'material-ui/svg-icons/action/home';
import Planner from 'material-ui/svg-icons/action/event';
import Meal from 'material-ui/svg-icons/maps/restaurant';
import List from 'material-ui/svg-icons/action/add-shopping-cart';

function getHeader() {
    return (
        <Toolbar>
            <ToolbarGroup>
                {getLink('/', 'Home', <Home/>)}
                <ToolbarTitle text="House Food" />
            </ToolbarGroup>
            <ToolbarGroup>
                {getLink('/Planner', 'Meal planner', <Planner/>)}
                {getLink('/Meal/Header', 'Meals', <Meal/>)}
                {getLink('/List/Header', 'Shopping lists', <List/>)}
            </ToolbarGroup>
        </Toolbar>
    );
}

function getLink(path: string, tooltipText: string, icon: JSX.Element) {
    return (
        <Link to={path}>
            <IconButton tooltip={tooltipText}>
                {icon}
            </IconButton>
        </Link>
    );
}

function Header() {
    return (
        <div>
            {getHeader()}
        </div>
    );
}

export default Header;
        
