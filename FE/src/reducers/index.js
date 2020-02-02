import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import DormReducer from './DormReducer';
import RoomReducer from './RoomReducer';
import LogsReducer from './LogsReducer';

const rootReducer = combineReducers({
    dorm: DormReducer,
    rooms: RoomReducer,
    logs: LogsReducer,
    form: reduxForm
});

export default rootReducer;