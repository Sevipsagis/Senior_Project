import { DORM_FETCH, DORM_EDIT } from '../actions/types';

export default function (state = [], action) {
    switch (action.type) {
        case DORM_FETCH:
            return action.payload;
        case DORM_EDIT:
            return { ...state, saved: true, msg: "Update Complete" };
        default:
            return state;
    }
}