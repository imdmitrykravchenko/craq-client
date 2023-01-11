import { Context, actionsMiddleware } from 'craq';
import historyMiddleware from 'router6-history';

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
    run: (href: string) => {
      if (!runPromise) {
        runPromise = context.router.navigateToPath(href);
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
