import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import FormField from './FormField';
var setting = [
    { label: "Rented Room Price", name: "room_price", type: "number", required: true },
    { label: "Elect Unit Price", name: "elect_price", type: "number", required: true },
    { label: "Water Unit Price", name: "water_price", type: "number", required: true }
];

class SettingForm extends React.Component {

    renderField(setting) {
        return setting.map(({ label, name, type, required }) => {
            return <Field key={name} label={label} name={name} type={type} required={required} component={FormField} />
        })
    }

    render() {
        const { settingSubmit } = this.props;
        return (
            <div>
                <form onSubmit={this.props.handleSubmit(settingSubmit)}>
                    {this.renderField(setting)}
                    <button className="btn btn-block btn-success mt-3" type="submit">Save</button>
                </form>
            </div>
        )
    }
}

function mapStateToProps({ dorm }) {
    console.log(dorm)
    if (dorm && dorm._id) {
        return { initialValues: dorm };
    } else
        return {};
}

function validate(values) {
    const error = {};
    setting.forEach(({ name, required }) => {
        if (!values[name] && required) {
            error[name] = "Please insert your value.";
        }
    })
    return error;
}

SettingForm = reduxForm({ validate, form: "settingForm" })(SettingForm);

export default connect(mapStateToProps)(SettingForm);