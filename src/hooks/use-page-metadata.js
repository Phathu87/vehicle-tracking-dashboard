import { useEffect } from 'react';

const DEFAULT_DESCRIPTION = 'Fleet Drive AI Demo is a working fleet-management demonstration with simulated fleet data and a real Express API.';

function setMeta(selector, attribute, value) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

export function usePageMetadata(title, description = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    const pageTitle = `${title} | Fleet Drive AI`;
    document.title = pageTitle;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', description);
  }, [description, title]);
}
