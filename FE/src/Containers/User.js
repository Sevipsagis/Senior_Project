import React from 'react';
import { browserHistory } from 'react-redux';
import { connect } from 'react-redux';
import { roomFetch, roomDelete, roomOn, roomOff, billRoom, floorFetch, dormFetch, activeRoomFetch, billAll } from '../actions';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import RoomsList from '../Components/rooms/RoomsList';
import ButtonGroup from '../Components/buttonGroup';

class User extends React.Component {

    componentDidMount() {
        console.log(this.props)
        this.props.floorFetch(1);
        this.props.dormFetch();
    }

    render() {
        const { dorm, rooms, roomDelete, roomOn, roomOff, billRoom, floorFetch, billAll } = this.props;
        return (
            <div>
                <Header />
                <div className="container-fluid mb-3">
                    <div className="row">
                        <div className="mt-4 mb-4 pl-5 offset-1">
                            <h2>Customer Profile</h2>
                        </div>
                        <div className="col-md-7 row d-flex justify-content-between ml-3">
                            <div className="col-sm-12 col-md-2 mt-4 mb-4">
                                <button className="btn btn-block btn-danger" onClick={() => billAll(dorm)}>Bill All</button>
                            </div>
                            <div className="col-sm-12 col-md-3 mb-4 mt-4">
                                <ButtonGroup floorFetch={floorFetch} />
                            </div>
                        </div>

                    </div>
                </div>
                <div className="container">
                    {rooms.saved && <div className="alert alert-danger ml-3 mr-3 alert-dismissible fade show" role="alert">
                        Unregister Complete
                        <button type="button" class="close" aria-label="Close" onClick={() => window.location.reload()}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>}
                    {rooms.bill && <div className="alert alert-danger ml-3 mr-3 alert-dismissible fade show" role="alert">
                        Bill Complete
                        <button type="button" class="close" aria-label="Close" onClick={() => window.location.reload()}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>}
                    {rooms.length > 0 &&
                        <RoomsList dorm={dorm} rooms={rooms} roomDelete={roomDelete} roomOn={roomOn} roomOff={roomOff} billRoom={billRoom} />
                    }
                    {rooms.rooms &&
                        <RoomsList dorm={dorm} rooms={rooms.rooms} roomDelete={roomDelete} roomOn={roomOn} roomOff={roomOff} billRoom={billRoom} />
                    }
                </div>
                <Footer />
            </div >
        )
    }
}

function mapStateToProps({ dorm, rooms }) {
    console.log(rooms);
    return { dorm, rooms };
}

export default connect(mapStateToProps, { dormFetch, roomFetch, roomDelete, roomOn, roomOff, billRoom, floorFetch, activeRoomFetch, billAll })(User);