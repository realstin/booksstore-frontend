import { useEffect } from 'react';

/**
 * usePageMeta
 *
 * Sets the browser tab title and the meta description for the current page,
 * and restores the previous values when the page unmounts or the values change.
 *
 * Search engines use the title and description to show a result for the page,
 * so every page with its own content should set them.
 *
 * Why not render <title>/<meta> inside the component (React 19 hoisting)?
 * index.html already contains a <meta name="description">. Hoisting would add
 * a second one beside it. This hook updates the single existing tag instead.
 */

function getOrCreateDescriptionTag() {
  let tag = document.head.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', 'description');
    document.head.appendChild(tag);
  }
  return tag;
}

export function usePageMeta({ title, description }) {
  useEffect(() => {
    // Nothing to set yet (for example, the book is still loading).
    if (!title && !description) return undefined;

    const previousTitle = document.title;
    const tag = getOrCreateDescriptionTag();
    const previousDescription = tag.getAttribute('content');

    if (title) document.title = title;
    if (description) tag.setAttribute('content', description);

    return () => {
      document.title = previousTitle;
      if (previousDescription === null) tag.remove();
      else tag.setAttribute('content', previousDescription);
    };
  }, [title, description]);
}