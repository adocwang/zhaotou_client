import React from 'react';
import Menu from './Menu/Menu';

require('./App.css');

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Menu/>
                {this.props.children}
            </div>
        );
    }
}
