import { ServiceContext, ActionContext, NavigateCraqActionPayload } from 'craq';
import { Head } from './createHead';

export type ClientServiceContext = ServiceContext;

export type ClientActionContext<T> = ActionContext<T> & {
  head: Head;
};

export type ClientNavigateCraqAction<T = {}> = (
  context: ClientActionContext<T>,
  payload: NavigateCraqActionPayload,
) => any;
