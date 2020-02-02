import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { connect } from 'react-redux';
import { roomEdit, getProfile } from '../actions';
import EditForm from '../Components/Form/EditForm';

class Edit extends React.Component {

    componentDidMount() {
        // console.log(this.props.match.params.id)
        this.props.getProfile(this.props.match.params.id)
    }

    render() {
        const { formValues, rooms, roomEdit } = this.props;
        return (
            <div>
                <Header />
                <div className="mt-5 mb-5 offset-1 text-left"><h2>Edit Profile</h2></div>
                <div className="container col-md-7">
                    {rooms.saved && <div className="alert alert-success alert-dismissible fade show" role="alert">
                        Update Complete
                        <button type="button" class="close" aria-label="Close" onClick={() => window.location.reload()}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>}
                    < EditForm editSubmit={() => roomEdit(rooms.room, formValues)} rooms={rooms} />
                </div>
                <Footer />
                <Footer />
            </div>
        )
    }
}

function mapStateToProps({ form, rooms }) {
    return { formValues: form.editForm ? form.editForm.values : null, rooms };
}

export default connect(mapStateToProps, { roomEdit, getProfile })(Edit);