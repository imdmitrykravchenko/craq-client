import Router6, { RouteDefinition } from 'router6';
import { CraqAction, Registry, Store } from 'craq';
import createHead from './createHead';
import ClientContext from './ClientContext';

const configureContext = <T, S>(
  {
    store,
    actions,
    components,
    routes,
  }: {
    actions: Registry<CraqAction<S, any>>;
    components: Registry<T>;
    store: Store<S, any>;
    routes: RouteDefinition[];
  },
  head = createHead(),
) =>
  new ClientContext(
    {
      store,
      router: new Router6(routes),
      registries: { actions, components },
    },
    head,
  );

export default configureContext;
