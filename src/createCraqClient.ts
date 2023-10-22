import { Context } from 'craq';
import actionsMiddleware from 'craq-route-actions';

const createCraqClient = (context: Context<any, any>, { renderers }) => {
  context.router.use(
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
        const { stats, router } = context;

        runPromise = stats?.error?.route
          ? router.navigateToRoute(stats.error.route)
          : router.navigateToPath(href);
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
