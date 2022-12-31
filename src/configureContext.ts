import Router6, { RouteDefinition } from 'router6';
import { ReducersMapObject, configureStore } from '@reduxjs/toolkit';
import { CraqAction, Registry } from 'craq';
import createHead from './createHead';
import ClientContext from './ClientContext';

const configureContext = <T, S>(
  {
    reducers,
    actions,
    components,
    routes,
  }: {
    actions: Registry<CraqAction<S>>;
    components: Registry<T>;
    reducers: ReducersMapObject;
    routes: RouteDefinition[];
  },
  head = createHead(),
) =>
  new ClientContext(
    {
      store: configureStore({
        reducer: reducers,
        devTools: true,
        // @ts-ignore
        preloadedState: window.__INITIAL_STATE__ as S,
      }),
      router: new Router6(routes),
      registries: { actions, components },
    },
    head,
  );

export default configureContext;
