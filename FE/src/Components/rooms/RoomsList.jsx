import React from 'react';
import Room from './Room'
class RoomsList extends React.Component {

    showRooms() {
        const { dorm, rooms, roomDelete, roomOn, roomOff, billRoom } = this.props;
        console.log(rooms)
        if (rooms) {
            return rooms.map(room => (
                <Room key={room.room} dorm={dorm} room={room} roomDelete={roomDelete} roomOn={roomOn} roomOff={roomOff} billRoom={billRoom} />
            ))
        }
    }

    render() {
        const { rooms } = this.props;
        return (
            <div className="row">
                {rooms.length > 0 && this.showRooms()}
            </div>
        )
    }
}

export default RoomsList;