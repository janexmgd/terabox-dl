const getShortUrl = (url) => {
  const trimmedUrl = url.trimEnd('/');
  return trimmedUrl.split('/').pop();
};
export default getShortUrl;
