import React from 'react';

class RoomStat extends React.Component {
    render() {
        const { rooms, logs } = this.props;
        console.log(logs)
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="card bg-light mb-3 col-md-3 ml-3 mr-3">
                        <div className="card-body pt-4 pb-4 text-left">
                            <h5 className="card-title">Customer Name</h5>
                            <p className="card-text"><span className="mr-2 text-success" style={{ "fontSize": 30 }}>{rooms.firstname ? `${rooms.firstname} ${rooms.lastname}` : "Empty Room"}</span></p>
                        </div>
                    </div>
                    <div className="card bg-light mb-3 col-md-3 ml-3 mr-3">
                        <div className="card-body pt-4 pb-4 text-left">
                            <h5 className="card-title">Total Electrical Consumption</h5>
                            <p className="card-text"><span className="mr-2" style={{ "fontSize": 30, "color": "#00BFFF" }}>{logs[new Date().getMonth()].elect ? logs[new Date().getMonth()].elect.toFixed(4) : 0.0000}</span> Units in this month</p>
                        </div>
                    </div>
                    <div className="card bg-light mb-3 col-md-3 ml-3 mr-3">
                        <div className="card-body pt-4 pb-4 text-left">
                            <h5 className="card-title">Total Water Consumption</h5>
                            <p className="card-text"><span className="mr-2" style={{ "fontSize": 30, "color": "#FF6347" }}>{logs[new Date().getMonth()].water ? logs[new Date().getMonth()].water.toFixed(4) : 0.0000}</span> Units in this month</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RoomStat;