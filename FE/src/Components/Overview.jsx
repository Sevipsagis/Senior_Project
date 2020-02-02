import React from 'react';

class Overview extends React.Component {
    render() {
        const { elec_usage, water_usage, rooms } = this.props;
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="card bg-light mb-3 col-md-3 ml-3 mr-3">
                        <div className="card-body pt-4 pb-4 text-left">
                            <h5 className="card-title">Total Electrical Consumption</h5>
                            <p className="card-text"><span className="mr-2" style={{ "fontSize": 30, "color": "#00BFFF" }}>{elec_usage ? elec_usage.toFixed(4) : 0}</span> Units in this month</p>
                        </div>
                    </div>
                    <div className="card bg-light mb-3 col-md-3 ml-3 mr-3">
                        <div className="card-body pt-4 pb-4 text-left">
                            <h5 className="card-title">Total Water Consumption</h5>
                            <p className="card-text"><span className="mr-2" style={{ "fontSize": 30, "color": "#FF6347" }}>{water_usage ? water_usage.toFixed(4) : 0}</span> Units in this month</p>
                        </div>
                    </div>
                    <div className="card bg-light mb-3 col-md-3 ml-3 mr-3">
                        <div className="card-body pt-4 pb-4 text-left">
                            <h5 className="card-title">Empty Rooms</h5>
                            <p className="card-text"><span className="mr-2 text-success" style={{ "fontSize": 30 }}>{rooms ? rooms : 0}</span> Rooms</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Overview;