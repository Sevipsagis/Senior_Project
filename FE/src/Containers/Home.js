import React from 'react';
import { connect } from 'react-redux';
import { dormFetch, inactiveRoomFetch } from '../actions';
import Header from '../Components/Header'
import Footer from '../Components/Footer';
import Overview from '../Components/Overview';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';

class Home extends React.Component {

    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
        this.props.dormFetch();
        this.props.inactiveRoomFetch();
        console.log(this.props)
    }

    render() {
        return (
            <div>
                <Header />
                <div className="mt-5 mb-5 offset-1 text-left"><h2>Overview</h2></div>
                {this.props.dorm.logs && this.props.rooms &&
                    <Overview elec_usage={this.props.dorm.logs[new Date().getMonth()].elect} water_usage={this.props.dorm.logs[new Date().getMonth()].water} rooms={this.props.rooms.length} />
                }
                <div className="container-fluid d-flex justify-content-center mt-4">
                    <div className="row col-md-10" style={{ height: "50vh" }}>
                        <ResponsiveContainer width="99%" height="100%">
                            <BarChart data={this.props.dorm.logs ? this.props.dorm.logs : [{ name: "Jan" }, { name: "Feb" }, { name: "Mar" }, { name: "Apr" }, { name: "May" }, { name: "Jun" }, { name: "Jul" }, { name: "Aug" }, { name: "Sep" }, { name: "Oct" }, { name: "Nov" }, { name: "Dec" }]}>
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
        );
    }
}

function mapStateToProps({ dorm, rooms }) {
    if (dorm && rooms) {
        return { dorm, rooms }
    }
}

export default connect(mapStateToProps, { dormFetch, inactiveRoomFetch })(Home);