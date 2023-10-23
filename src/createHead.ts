type MetaItem = {
  content: string;
  name?: string;
  property?: string;
  httpEquiv?: string;
  uniq?: boolean;
};
type HeadLink = {
  rel: string;
  href: string;
  attributes?: Record<string, string>;
  uniq?: boolean;
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

const setAttributes = (node: Element, attributes: Record<string, any>) =>
  Object.entries(attributes)
    .filter(
      ([key, value]) =>
        value && (typeof value === 'string' || key === 'attributes'),
    )
    .forEach(([key, value]) => {
      if (key === 'attributes') {
        setAttributes(node, value);
      } else {
        node.setAttribute(key, value);
      }
    });

const uniqMetaNames = new Set([
  'description',
  'viewport',
  'robots',
  'keywords',
  'author',
]);

const uniqLinkRels = new Set(['canonical']);

const isMetaUniq = (meta: MetaItem) =>
  uniqMetaNames.has(meta.name) ||
  meta.uniq ||
  `${meta.property}`.startsWith('og:') ||
  `${meta.property}`.startsWith('twitter:');
const isLinkUniq = (link: HeadLink) => uniqLinkRels.has(link.rel) || link.uniq;
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

  const appendChild = (tagName: string, item: object) => {
    const node = document.createElement(tagName);

    setAttributes(node, item);
    document.head.appendChild(node);
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
    setMeta: (item: MetaItem) => {
      const uniqProp = ['name', 'property', 'httpEquiv'].find(
        (name) => name in item,
      );

      const node = document.head.querySelector(
        `meta[${uniqProp}="${item[uniqProp]}"]`,
      );

      if (node) {
        setAttributes(node, item);
      } else {
        appendChild('meta', item);
      }

      return head;
    },
    addMeta: (item: MetaItem) => {
      if (isMetaUniq(item)) {
        return head.setMeta(item);
      }

      appendChild('meta', item);

      return head;
    },
    setLink: (link: HeadLink) => {
      const node = document.head.querySelector(`link[rel="${link.rel}"]`);

      if (node) {
        setAttributes(node, link);
      } else {
        appendChild('link', link);
      }

      return head;
    },
    addLink: (link: HeadLink) => {
      if (isLinkUniq(link)) {
        return head.setLink(link);
      }

      appendChild('link', link);

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
    getLang: () => document.documentElement.getAttribute('lang'),
    setLang: (lang: string) => {
      document.documentElement.setAttribute('lang', lang);

      return head;
    },
  };

  return head;
};

export default createHead;

export type Head = ReturnType<typeof createHead>;
