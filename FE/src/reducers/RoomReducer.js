import { ROOM_FETCH, ACTIVE_ROOM_FETCH, INACTIVE_ROOM_FETCH, ROOM_EDIT, ROOM_REGISTER, SELECT_ROOM_FETCH, DELETE_ROOM, BILL_ROOM, FLOOR_FETCH, BILL_ALL } from '../actions/types';

export default function (state = [], action) {
    switch (action.type) {
        case ROOM_FETCH:
        case ACTIVE_ROOM_FETCH:
        case INACTIVE_ROOM_FETCH:
        case SELECT_ROOM_FETCH:
        case FLOOR_FETCH:
            return action.payload;
        case ROOM_EDIT:
        case ROOM_REGISTER:
            return { ...state, saved: true, msg: "Update Complete" };
        case DELETE_ROOM:
            return { rooms: action.payload, saved: true, msg: "Delete Complete" }
        case BILL_ROOM:
        case BILL_ALL:
            return { rooms: action.payload, bill: true, msg: "Bill Complete" }
        default:
            return state;
    }
}