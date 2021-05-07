import { configureStore, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import rootReducer, { RootState } from '@store/rootReducer';

const middleware = getDefaultMiddleware({
  serializableCheck: false,
});

const store = configureStore({
  reducer: rootReducer,
  middleware,
});

//https://github.com/gaearon/react-hot-loader/blob/master/docs/Troubleshooting.md#common-typescript-mistake
if (process.env.NODE_ENV === 'development' && (module as any).hot) {
  (module as any).hot.accept('./rootReducer', () => {
    // eslint-disable-next-line
    const newRootReducer = require('./rootReducer').default;
    store.replaceReducer(newRootReducer);
  });
}

export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export default store;
