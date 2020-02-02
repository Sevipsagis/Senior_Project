import React from 'react';
import { Link } from 'react-router-dom';

class Room extends React.Component {
    render() {
        const { dorm, room, roomOn, roomOff, roomDelete, billRoom } = this.props;
        return (
            <div className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
                <div className="card bg-light mb-4" style={{ width: "90%" }}>
                    {/* <img src="/public/favicon.ico" className="card-img-top" alt="" /> */}
                    <div className="card-body" style={{ paddingBottom: "0.4rem" }}>
                        <div className="d-flex justify-content-between">
                            <Link to={`/profile/${room.room}`} className="h5 text-left text-secondary text-decoration-none" style={{ marginBottom: "0" }}>Room {room.room}</Link>
                            <div className="btn-group">
                                <p className="btn btn-light btn-sm" style={{ marginBottom: "0" }} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">•••</p>
                                <div className="dropdown-menu">
                                    <div className="container">
                                        <div className="row">
                                            <button className="dropdown-item col-md-6 text-success" onClick={() => room.status ? roomOn(room.room) : alert("It's an empty room")}><b>ON</b></button>
                                            <button className="dropdown-item col-md-6 text-danger" onClick={() => room.status ? roomOff(room.room) : alert("It's an empty room")}><b>OFF</b></button>
                                        </div>
                                    </div>
                                    <button className="dropdown-item text-secondary" onClick={() => room.status ? billRoom(room.room, { email: room.email, data: room, dorm: dorm }) : alert("It's an empty room")}>Bill Room</button>
                                    <Link className="dropdown-item text-secondary" to={room.status ? `/edit/${room.room}` : '/profile'} onClick={() => { if (!room.status) alert("It's an empty room") }}>Edit Profile</Link>
                                    <button className="dropdown-item text-secondary" onClick={() => room.status ? roomDelete(room.room) : alert("It's an empty room")}>Unregister</button>
                                </div>
                            </div>
                        </div>
                        {room.status && <p className="card-text text-success font-weight-bold ml-1">• Active</p>}
                        {!room.status && <p className="card-text text-danger font-weight-bold ml-1">• Inactive</p>}
                        {/* <p className="card-text text-primary font-weight-bold">{room.firstname} {room.lastname}</p> */}
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">
                                        <p className="text-center text-secondary" style={{ marginBottom: "0.7rem" }}>Elect Usage</p>
                                        <p className="text-center font-weight-normal" style={{ marginBottom: "0" }}><span className="h5 font-weight-bold" style={{ color: "#00BFFF" }}>{room.elect_usage.toFixed(2)} </span> Units</p>
                                    </th>
                                    <th scope="col">
                                        <p className="text-center text-secondary" style={{ marginBottom: "0.7rem" }}>Water Usage</p>
                                        <p className="text-center font-weight-normal" style={{ marginBottom: "0" }}><span className="h5 font-weight-bold" style={{ color: "#FF6347" }}>{room.water_usage.toFixed(2)} </span> Units</p>
                                    </th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div >
        )
    }
}

export default Room;