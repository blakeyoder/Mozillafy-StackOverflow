const W3_REGEX = 'https?:\/\/(www\.)?w3schools\.com\/*';
const DDG_URI = 'https://api.duckduckgo.com/?q={QUERY}&format=json';
const GOOGLE_URL = 'https://google.com/search?query={QUERY}';

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
      let searchComponent = encodeURIComponent(partitionAndClean(link));
      let requestURI = DDG_URI.replace('{QUERY}', searchComponent); 
      fetch(requestURI)
        .then(response => response.json())
        .then(newLink => injectIntoDOM(link, newLink))
        .catch(err => console.log(err));
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
 * Swap the W3 href with the MDN href
 *
 * @param link - original dom el
 * @param mdnLink - new link to be injected
 */
function injectIntoDOM(link, mdnLink) {
  link.href = mdnLink.AbstractURL;
}
