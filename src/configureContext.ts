import Router6 from 'router6';
import { CraqAction, Registry, Store } from 'craq';
import createHead from './createHead';
import ClientContext from './ClientContext';

const configureContext = <T, S>(
  {
    store,
    actions,
    components,
    router,
  }: {
    actions: Registry<CraqAction<S, any>>;
    components: Registry<T>;
    store: Store<S, any>;
    router: Router6;
  },
  head = createHead(),
) =>
  new ClientContext(
    {
      store,
      router,
      registries: { actions, components },
    },
    head,
  );

export default configureContext;
