import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { connect } from 'react-redux';
import { roomRegister, inactiveRoomFetch } from '../actions';
import RegisterForm from '../Components/Form/RegisterForm';

class Register extends React.Component {

    async componentDidMount() {
        this.props.inactiveRoomFetch();
    }

    render() {
        const { formValues, rooms, roomRegister } = this.props;
        return (
            <div>
                <Header />
                <div className="mt-5 offset-1 text-left"><h2>Register</h2></div>
                <div className="container col-md-7">
                    {rooms.saved && <div className="alert alert-success alert-dismissible fade show" role="alert">
                        Register Complete
                        <button type="button" class="close" aria-label="Close" onClick={() => window.location.reload()}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>}
                    {rooms.length === 0 && <div className="alert alert-danger">Sorry, not have empty room</div>}
                    {rooms &&
                        < RegisterForm registerSubmit={() => roomRegister(formValues)} options={rooms} />
                    }
                </div>
                <Footer />
                <Footer />
            </div>
        )
    }
}

function mapStateToProps({ form, rooms }) {
    return { formValues: form.registerForm ? form.registerForm.values : null, rooms };
}

export default connect(mapStateToProps, { roomRegister, inactiveRoomFetch })(Register);