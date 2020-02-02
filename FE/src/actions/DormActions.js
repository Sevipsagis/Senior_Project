import axios from 'axios';
import { DORM_FETCH, DORM_EDIT } from './types';

export const dormFetch = () => {
    return dispatch => {
        axios.get('http://localhost:8000/').then(res => {
            dispatch({ type: DORM_FETCH, payload: res.data })
        })
    }
}

export const dormEdit = (values) => {
    return dispatch => {
        axios.put('http://localhost:8000/', values).then(res => {
            dispatch({ type: DORM_EDIT, payload: res.data })
        })
    }
}