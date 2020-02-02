import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer'
import RoomStat from '../Components/RoomStat';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { getProfile, getLogs } from '../actions';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';

class Profile extends React.Component {

    componentDidMount() {
        this.props.getProfile(this.props.match.params.id);
        this.props.getLogs(this.props.match.params.id);
        console.log(this.props);
    }

    render() {
        return (
            <div>
                <Header />
                <div className="container-fluid">
                    <div className="row d-flex justify-content-between">
                        <div className="col-md-2 mt-4 mb-5 pl-5 text-center">
                            <h2>Room {this.props.match.params.id}</h2>
                        </div>
                        <div className="col-md-3 mt-4 mb-5 pr-5 text-center">
                            <Link to={`edit/${this.props.rooms.room}`} className="btn btn-secondary">Edit Profile</Link>
                        </div>
                    </div>
                </div>
                {this.props.rooms && this.props.logs.logs &&
                    <RoomStat rooms={this.props.rooms} logs={this.props.logs.logs} />
                }
                <div className="container-fluid d-flex justify-content-center mt-4">
                    <div className="row col-md-10" style={{ height: "50vh" }}>
                        <ResponsiveContainer width="99%" height="100%">
                            <BarChart data={this.props.logs.logs ? this.props.logs.logs : [{ name: "Jan" }, { name: "Feb" }, { name: "Mar" }, { name: "Apr" }, { name: "May" }, { name: "Jun" }, { name: "Jul" }, { name: "Aug" }, { name: "Sep" }, { name: "Oct" }, { name: "Nov" }, { name: "Dec" }]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="elect" fill="#00BFFF" />
                                <Bar dataKey="water" fill="#FF6347" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

function mapStateToProps({ rooms, logs }) {
    if (rooms && logs) {
        console.log(logs)
        return { rooms, logs }
    }
}

export default connect(mapStateToProps, { getProfile, getLogs })(Profile);