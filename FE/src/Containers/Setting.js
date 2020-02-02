import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer'
import SettingForm from '../Components/Form/SettingForm';
import { connect } from 'react-redux';
import { dormFetch, dormEdit } from '../actions'

class Setting extends React.Component {

    componentDidMount() {
        this.props.dormFetch();
    }

    render() {
        const { formValues, dorm, dormEdit } = this.props;
        return (
            <div>
                <Header />
                <div className="mt-5 mb-5 offset-1 text-left"><h2>Setting</h2></div>
                <div className="container col-md-4">
                    {dorm.saved && <div className="alert alert-success alert-dismissible fade show" role="alert">
                        Update Complete
                        <button type="button" class="close" aria-label="Close" onClick={() => window.location.reload()}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>}
                    <SettingForm settingSubmit={() => dormEdit(formValues)} dorm={dorm} />
                </div>
                <Footer />
            </div >
        )
    }
}

function mapStateToProps({ form, dorm }) {
    return { formValues: form.settingForm ? form.settingForm.values : null, dorm };
}

export default connect(mapStateToProps, { dormFetch, dormEdit })(Setting);