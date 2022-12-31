type MetaItem = {
  content: string;
  name?: string;
  property?: string;
  httpEquiv?: string;
};
type HeadLink = {
  rel: string;
  href: string;
  attributes?: Record<string, string>;
};
type InlineContent = {
  type: 'style' | 'script';
  content: string;
};
type HeadScript = {
  src: string;
  attributes?: Record<string, string | boolean>;
};
type HeadMeta = {
  title: string;
  base: string;
  lang: string;
  meta: MetaItem[];
  links: HeadLink[];
  scripts: HeadScript[];
  inlines: InlineContent[];
};

const setAttributes = (node: Element, attributes: Record<string, string>) =>
  Object.entries(attributes)
    .filter(([_, value]) => value)
    .forEach(([key, value]) => {
      node.setAttribute(key, value);
    });

const uniqMetaNames = new Set(['description', 'viewport']);

const createHead = () => {
  const headMeta: HeadMeta = {
    title: '',
    base: '',
    lang: '',
    meta: [
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
      },
    ],
    links: [],
    scripts: [],
    inlines: [],
  };

  const head = {
    setTitle: (title: string) => {
      document.title = title;
      return head;
    },
    setBase: (base: string) => {
      headMeta.base = base;
      return head;
    },
    addMeta: (item: MetaItem) => {
      let node = document.querySelector(`meta[name="${item.name}"]`);

      if (!node) {
        node = document.createElement('meta');
        document.head.appendChild(node);
      }

      setAttributes(node, item);

      return head;
    },
    addLink: (link: HeadLink) => {
      headMeta.links.push(link);
      return head;
    },
    addScript: (script: HeadScript) => {
      headMeta.scripts.push(script);
      return head;
    },
    addInline: (inline: InlineContent) => {
      headMeta.inlines.push(inline);
      return head;
    },
    getLang: () => headMeta.lang,
  };

  return head;
};

export default createHead;

export type Head = ReturnType<typeof createHead>;
