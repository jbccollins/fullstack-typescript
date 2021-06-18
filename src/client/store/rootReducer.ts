// import { combineReducers } from '@reduxjs/toolkit'

// // Reducers
// import counterReducer from '@client/components/Counter/counterSlice'

// const rootReducer = combineReducers({
//   counter: counterReducer,
// })

// export type RootState = ReturnType<typeof rootReducer>

// export default rootReducer

import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import counterReducer from '@client/store/slices/counterSlice';

const rootReducer = combineReducers({
  counter: counterReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
