import axios from 'axios';
import { GET_LOGS } from './types'

export const getLogs = (id) => {
    return dispatch => {
        axios.get('http://localhost:8000/logs/' + id).then(res => {
            dispatch({ type: GET_LOGS, payload: res.data })
        })
    }
}