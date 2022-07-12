import React from 'react';
import ReactDOM from 'react-dom/client';
import historyMiddleware from 'router6-history/src';
import { ForbiddenError, isRoutingError, NotFoundError } from 'router6/src';

import Context from 'craq/src/core/Context';
import actionsMiddleware from 'craq/src/core/actionsMiddleware';
import createApp from 'craq/src/core/createApp';

type ServerStats = {
  actions: { [actionName: string]: boolean };
  error: { code: number };
};

const rehydrateError = (error) => {
  switch (error?.code) {
    case 404:
      return new NotFoundError(error.message);
    case 403:
      return new ForbiddenError(error.message);
    default:
      return undefined;
  }
};

export const createCraqClient = (context: Context<any>, App, { bundles }) => {
  context.router
    .use(() => ({ to }, next) => {
      const bundle = bundles[to.config.bundle];

      return bundle().then(() => next());
    })
    .use(historyMiddleware())
    .use(
      actionsMiddleware(
        context,
        {
          isServer: false,
          executionFlow: (execution, next) => {
            if (context.router.isStarted()) {
              execution.catch((e) => {
                if (isRoutingError(e)) {
                  context.router.error = e;
                }
              });
              next();
            } else {
              return execution.then(() => next(), next);
            }
          },
        },
        // @ts-ignore
        (__SERVER_STATS__ as ServerStats).actions,
      ),
    );

  const CraqApp = createApp(App);

  let runPromise;

  return {
    run: (href: string) => {
      if (!runPromise) {
        runPromise = context.router.start(
          href,
          // @ts-ignore
          rehydrateError((__SERVER_STATS__ as ServerStats).error),
        );
      }

      return {
        render: (node: Element | Document) =>
          runPromise.then(() =>
            ReactDOM.hydrateRoot(node, <CraqApp context={context} />),
          ),
      };
    },
  };
};
