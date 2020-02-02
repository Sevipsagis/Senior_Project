import React from 'react';
// { rooms, label, meta, input }
class SelectionField extends React.Component {

    showOptions(options) {
        console.log("option", options)
        if (options) {
            return options.map((room) => <option key={room.room} >{room.room}</option>);
        }
    }

    render() {
        const { options, label, input, meta } = this.props

        return (
            <div className="form-group">
                <label className="offset-md-10">{label}</label>
                <select className="form-control col-md-2 offset-md-10" {...input} >
                    <option></option>
                    {this.showOptions(options)}
                </select>
                {meta.error && meta.touched &&
                    <div className="mt-2 text-danger offset-md-10">Choose your room</div>
                }
            </div>
        )
    }
}

export default SelectionField;