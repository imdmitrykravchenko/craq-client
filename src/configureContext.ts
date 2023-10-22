import Router6 from 'router6';
import { CraqAction, Registry, Store } from 'craq';
import createHead from './createHead';
import ClientContext from './ClientContext';

const configureContext = <T, S>(
  {
    getStore,
    actions,
    components,
    getRouter,
  }: {
    actions: Registry<CraqAction<S, any>>;
    components: Registry<T>;
    getStore: () => Store<S, any>;
    getRouter: (context: ClientContext<S, any>) => Router6;
  },
  head = createHead(),
) => {
  const clientContext = new ClientContext(
    {
      store: getStore(),
      registries: { actions, components },
    },
    head,
  );

  clientContext.router = getRouter(clientContext);
  clientContext.stats =
    // @ts-ignore
    (typeof window !== undefined && window?.__SERVER_STATS__) || {};

  return clientContext;
};

export default configureContext;
