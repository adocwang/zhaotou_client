import React, { PropTypes } from 'react';
import { Link } from 'react-router';

class NavLink extends React.Component {
    constructor(props){
        super(props);
        // console.log(props);
    }
    render () {
        return (
            <li>
                <Link to={this.props.to} children={this.props.children} activeClassName="title-active"/>
            </li>
        );
    }
}

export default NavLink;
