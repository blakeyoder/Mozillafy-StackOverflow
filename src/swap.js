const W3_REGEX = 'https?:\/\/(www\.)?w3schools\.com\/*';
const DDG_URI = 'https://api.duckduckgo.com/?q={QUERY}&format=json';

fetchW3Links()
  .then(links => replaceWithMDN(links))

/**
 * Iterate over all links on the page and return only 
 * those that match the W3 regex
 *
 * @returns {Promise} array of W3 links
 */
function fetchW3Links() {
  return new Promise(resolve => {
    const links = document.links;
    let w3_links = [];
    for (let link of links) {
      if (link.href.match(W3_REGEX)) {
        w3_links.push(link);
      }
    }
    resolve(w3_links);
  });
}

/**
 * Makes a query to fetch an MDN resource. This works
 * almost none of the time right now :(
 *
 * @param links
 * @returns {Promise} Results of search query
 */
function replaceWithMDN(links) {
  return new Promise(resolve => {
    links.forEach(link => {
      advertiseW3Link(link);
      injectSearchBar(link);
    });
  });
}

/**
 * Returns the last part of a relative path url
 *
 * @param link
 * @returns {string}
 */
function partitionAndClean(link) {
  let parts = [];
  return link.href.split('/')
    .slice(-1)[0]
    .split('_')
    .slice(-1)[0]
    .replace('.asp', '')
}

/**
 * advertiseW3Link
 *
 * @param link
 * @returns {undefined}
 */
function advertiseW3Link(link) {
  const advertiseText = document.createTextNode(`
  <-- This is a W3 Schools link`);
  link.appendChild(advertiseText);
  link.style = `
    background-color:yellow`;
}

/**
 * Swap the W3 href with the MDN href
 *
 * @param link - original dom el
 */
function injectSearchBar(link) {
  const iframe = document.createElement('iframe');
  iframe.src = 'https://duckduckgo.com/search.html?prefill=Search DuckDuckGo';
  iframe.style ='overflow:hidden;margin:0;padding:0;width:400px;height:40px';
  iframe.id = 'ddg__iframe';
  link.appendChild(iframe);
}
