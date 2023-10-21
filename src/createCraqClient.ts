import { Context, actionsMiddleware } from 'craq';
import historyMiddleware from 'router6-history';
import { Route } from 'router6';

const createCraqClient = (context: Context<any, any>, { renderers }) => {
  context.router.use(historyMiddleware()).use(
    actionsMiddleware(context, {
      filter: ({ options }) => options?.serverOnly !== true,
      onSuccess: () => {},
      onError: () => {},
    }),
  );

  let runPromise;

  return {
    run: (to: string | Route) => {
      if (!runPromise) {
        runPromise =
          typeof to === 'string'
            ? context.router.navigateToPath(to)
            : context.router.navigateToRoute(to);
      }

      return {
        render: () =>
          runPromise.then(({ config, name }) => {
            const renderer = renderers[config.renderer];

            if (!renderer) {
              throw new Error(
                `Renderer "${config.renderer}" was not found, check "${name}" route config`,
              );
            }

            return renderer(context);
          }),
      };
    },
  };
};

export default createCraqClient;
