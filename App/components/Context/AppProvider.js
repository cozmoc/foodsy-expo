import React from 'react';

export class AppProvider extends React.Component {
    render() {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }
};
