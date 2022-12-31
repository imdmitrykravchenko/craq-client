import { Context, actionsMiddleware } from 'craq';
import { ForbiddenError, isRoutingError, NotFoundError } from 'router6';
import historyMiddleware from 'router6-history';

type ServerStats = {
  actions: { [actionName: string]: boolean };
  error: { code: number };
};

const rehydrateError = (error) => {
  switch (error?.code) {
    case 404:
      return new NotFoundError(error.message, error.meta);
    case 403:
      return new ForbiddenError(error.message, error.meta);
    default:
      return undefined;
  }
};

const createCraqClient = (
  context: Context<any>,
  App,
  { bundles, renderers },
) => {
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
                  // @ts-ignore
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
          runPromise.then(({ config, name }) => {
            const renderer = renderers[config.renderer];

            if (!renderer) {
              throw new Error(
                `Renderer "${config.renderer}" was not found, check "${name}" route config`,
              );
            }

            return renderer(context, App, { node });
          }),
      };
    },
  };
};

export default createCraqClient;
