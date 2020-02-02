import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import FormField from './FormField';
import FormFieldInline from './FormFieldInline';
var room = [
    { label: "Firstname", name: "firstname", type: "text", required: true },
    { label: "Lastname", name: "lastname", type: "text", required: true },
    { label: "E-mail", name: "email", type: "text", required: true },
    { label: "Telephone", name: "telephone", type: "text", required: true },
    { label: "Nationality", name: "nationality", type: "text", required: true },
    { label: "Personal ID / Passport ID", name: "personal_id", type: "text", required: true },
    { label: "Address", name: "address", type: "text", required: true }
];

class EditForm extends React.Component {

    // showOptions(rooms) {
    //     return rooms.map(({ room }) => <option key={room} value={room} >{room}</option>);
    // }

    render() {
        const { editSubmit } = this.props;
        return (
            <div>
                <form onSubmit={this.props.handleSubmit(editSubmit)}>
                    <div className="form-row">
                        <Field key="firstname" label="Firstname" name="firstname" type="text" required={true} component={FormFieldInline} />
                        <Field key="lastname" label="Lastname" name="lastname" type="text" required={true} component={FormFieldInline} />
                    </div>
                    <div className="form-row">
                        <Field key="email" label="E-mail" name="email" type="text" required={true} component={FormFieldInline} />
                        <Field key="telephone" label="Telephone" name="telephone" type="text" required={true} component={FormFieldInline} />
                    </div>
                    <div className="form-row">
                        <Field key="nationality" label="Nationality" name="nationality" type="text" required={true} component={FormFieldInline} />
                        <Field key="personal_id" label="Personal ID / Passport ID" name="personal_id" type="text" required={true} component={FormFieldInline} />
                    </div>
                    <Field key="address" label="Address" name="address" type="text" required={true} component={FormField} />
                    <br />
                    <button className="btn btn-block btn-success" type="submit">Save</button>
                </form>
            </div>
        )
    }
}

function mapStateToProps({ rooms }) {
    console.log(rooms)
    if (rooms && rooms._id) {
        return { initialValues: rooms }
    }
    else {
        return {}
    }
}

function validate(values) {
    const error = {};
    room.forEach(({ name, required }) => {
        if (!values[name] && required) {
            error[name] = "Please insert your value.";
        }
    })
    console.log(values)
    return error;
}

EditForm = reduxForm({ validate, form: "editForm" })(EditForm);

export default connect(mapStateToProps)(EditForm);