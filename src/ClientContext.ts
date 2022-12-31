import { Store } from '@reduxjs/toolkit';
import Router6 from 'router6';
import { Registries, Context } from 'craq';

import { ClientActionContext } from './types';
import { Head } from './createHead';

export default class ClientContext<S> extends Context<S> {
  public head: Head;
  protected actionContext: ClientActionContext<S>;
  constructor(
    {
      store,
      router,
      registries,
    }: {
      registries: Registries<S>;
      store: Store<S>;
      router: Router6;
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
