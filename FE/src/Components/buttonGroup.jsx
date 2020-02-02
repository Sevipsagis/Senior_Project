import React from "react";

class buttonGroup extends React.Component {

    constructor(props) {
        super(props);
        this.state = { b1: true, b2: false, b3: false }

    }
    render() {
        const { floorFetch } = this.props;
        return (
            <div className="btn-group btn-block btn-group-toggle" data-toggle="buttons">
                <button className={`btn btn-secondary ${this.state.b1 ? "active" : ""}`} onClick={() => { this.setState({ b1: true, b2: false, b3: false }); floorFetch(1) }}>1 Fl.</button>
                <button className={`btn btn-secondary ${this.state.b2 ? "active" : ""}`} onClick={() => { this.setState({ b1: false, b2: true, b3: false }); floorFetch(2) }}>2 Fl.</button>
                <button className={`btn btn-secondary ${this.state.b3 ? "active" : ""}`} onClick={() => { this.setState({ b1: false, b2: false, b3: true }); floorFetch(3) }}>3 Fl.</button>
            </div >
        )
    }
}

export default buttonGroup;