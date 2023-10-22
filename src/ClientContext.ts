import Router6 from 'router6';
import { Registries, Context, Store } from 'craq';

import { ClientActionContext } from './types';
import { Head } from './createHead';

export default class ClientContext<S, A> extends Context<S, A> {
  public head: Head;
  protected actionContext: ClientActionContext<S>;
  constructor(
    {
      store,
      router,
      registries,
    }: {
      registries: Registries<S>;
      store: Store<S, A>;
      router?: Router6;
    },
    head: Head,
  ) {
    super({ store, router, registries });

    this.head = head;
    this.actionContext = {
      ...this.actionContext,
      head,
    };
  }
}
