import React, { Component } from 'react';
import clipboardjs from 'clipboard'

new clipboardjs(".btn-copy")

class ButtonCopy extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: "COPY"
        }
    };

    copy () {
        this.setState({text: "COPIED"})

        setTimeout(() => {
            this.setState({text: "COPY"})
        },500)
    }

    render() {
        return (
            <button className="btn btn-default btn-copy" onClick={() => this.copy()} data-clipboard-text={this.props.copyText}>{this.state.text}</button>
        );
    }
}

export default ButtonCopy;