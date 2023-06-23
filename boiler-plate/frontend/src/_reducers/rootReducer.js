import { combineReducers } from 'redux'; // 여러 store를 combine 해줌
import user_reducer from './user_reducer';

const rootReducer = combineReducers({
  user_reducer,
});

export default rootReducer;
