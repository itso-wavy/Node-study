import Router from './routes/router';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers/rootReducer';

const storeWithMiddleware = applyMiddleware(
  promiseMiddleware,
  ReduxThunk
)(createStore);

function App() {
  return (
    <Provider
      store={storeWithMiddleware(
        Reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )}
    >
      <Router />
    </Provider>
  );
}

export default App;
