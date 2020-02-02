import React from 'react';
// import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import FormField from './FormField';
import FormFieldInline from './FormFieldInline';
import SelectionField from './SelectionField';
var register = [
    { label: "Room", name: "room", type: "text", required: true },
    { label: "Firstname", name: "firstname", type: "text", required: true },
    { label: "Lastname", name: "lastname", type: "text", required: true },
    { label: "E-mail", name: "email", type: "text", required: true },
    { label: "Telephone", name: "telephone", type: "text", required: true },
    { label: "Nationality", name: "nationality", type: "text", required: true },
    { label: "Personal ID / Passport ID", name: "personal_id", type: "text", required: true },
    { label: "Address", name: "address", type: "text", required: true }
];

class RegisterForm extends React.Component {

    // showOptions(rooms) {
    //     return rooms.map(({ room }) => <option key={room} value={room} >{room}</option>);
    // }

    render() {
        const { registerSubmit } = this.props;
        return (
            <div>
                <form onSubmit={this.props.handleSubmit(registerSubmit)}>
                    {/* <Field name="room" component="select" >
                        <option>Choose...</option>
                        {this.showOptions(this.props.rooms)}
                    </Field> */}
                    {this.props.options.length > 0 &&
                        <Field label="Room" name="room" component={SelectionField} options={this.props.options} required={true} />
                    }
                    {/* <Field key="room" label="room" name="room" type="text" required={true} component={FormFieldInline} /> */}
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

function validate(values) {
    const error = {};
    register.forEach(({ name, required }) => {
        if (!values[name] && required) {
            error[name] = "Please insert your value.";
        }
    })
    console.log(values)
    return error;
}

RegisterForm = reduxForm({ validate, form: "registerForm" })(RegisterForm);

export default RegisterForm;