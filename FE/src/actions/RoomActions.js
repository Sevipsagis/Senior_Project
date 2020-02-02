import axios from 'axios';
import { ROOM_FETCH, ACTIVE_ROOM_FETCH, INACTIVE_ROOM_FETCH, ROOM_EDIT, ROOM_REGISTER, ROOM_ON, ROOM_OFF, SELECT_ROOM_FETCH, DELETE_ROOM, BILL_ROOM, FLOOR_FETCH, BILL_ALL } from './types';

export const roomFetch = () => {
    return dispatch => {
        axios.get('http://localhost:8000/room').then(res => {
            dispatch({ type: ROOM_FETCH, payload: res.data })
        })
    }
}

export const getProfile = (id) => {
    return dispatch => {
        axios.get('http://localhost:8000/room/' + id).then(res => {
            dispatch({ type: SELECT_ROOM_FETCH, payload: res.data })
        })
    }
}

export const roomOn = (id) => {
    return dispatch => {
        axios.get('http://localhost:8000/room/' + id + '/ON').then(res => {
            dispatch({ type: ROOM_ON, payload: res.data })
        })
    }
}

export const roomOff = (id) => {
    return dispatch => {
        axios.get('http://localhost:8000/room/' + id + '/OFF').then(res => {
            dispatch({ type: ROOM_OFF, payload: res.data })
        })
    }
}

export const activeRoomFetch = () => {
    return dispatch => {
        axios.get('http://localhost:8000/active').then(res => {
            dispatch({ type: ACTIVE_ROOM_FETCH, payload: res.data })
        })
    }
}

export const inactiveRoomFetch = () => {
    return dispatch => {
        axios.get('http://localhost:8000/inactive').then(res => {
            dispatch({ type: INACTIVE_ROOM_FETCH, payload: res.data })
        })
    }
}

export const roomRegister = (values) => {
    return dispatch => {
        axios.put('http://localhost:8000/room', values).then(res => {
            dispatch({ type: ROOM_REGISTER, payload: res.data })
        })
    }
}

export const roomEdit = (id, values) => {
    return dispatch => {
        axios.put('http://localhost:8000/room/' + id, values).then(res => {
            dispatch({ type: ROOM_EDIT, payload: res.data })
        })
    }
}

export const roomDelete = (id) => {
    return dispatch => {
        axios.put('http://localhost:8000/delete/' + id).then(res => {
            axios.get('http://localhost:8000/floor/1').then(res => {
                dispatch({ type: DELETE_ROOM, payload: res.data })
            })
        })
    }
}

export const billRoom = (id, data) => {
    return dispatch => {
        axios.put('http://localhost:8000/bill/' + id, data).then(res => {
            axios.get('http://localhost:8000/floor/1').then(res => {
                dispatch({ type: BILL_ROOM, payload: res.data })
            })
        })
    }
}

export const billAll = (dorm) => {
    return dispatch => {
        axios.put('http://localhost:8000/billall/', dorm).then(res => {
            axios.get('http://localhost:8000/floor/1').then(res => {
                dispatch({ type: BILL_ALL, payload: res.data })
            })
        })
    }
}

export const floorFetch = (floor) => {
    return dispatch => {
        axios.get('http://localhost:8000/floor/' + floor).then(res => {
            dispatch({ type: FLOOR_FETCH, payload: res.data })
        })
    }
}

