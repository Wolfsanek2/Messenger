import type { rootReducer, store } from '@app';

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
