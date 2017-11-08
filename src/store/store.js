import { createStore,
  // applyMiddleware,
  // compose
} from 'redux';
// import createHistory from 'history/createBrowserHistory';
import rootReducer from '../reducers/reducers';
import initialState from './initial-state';

// export const history = createHistory()


const enhancers = []
// // const middleware = [
// //   routerMiddleware(history)
// // ]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

// const composedEnhancers = compose(
//   applyMiddleware(...middleware),
//   ...enhancers
// )

const Store = createStore(
  rootReducer,
  initialState,
  // composedEnhancers
)

export default Store;
