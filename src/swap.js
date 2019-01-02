const W3_REGEX = 'https?:\/\/(www\.)?w3schools\.com\/*';
const DDG_URI = 'https://api.duckduckgo.com/?q={QUERY}&format=json';
const IFRAME_CSS = new Map([
  ['overflow', 'hidden'],
  ['margin', 0],
  ['padding', 0],
  ['width', '400px'],
  ['height', '40px'],
  ['display', 'none'],
]);
const LINK_CSS = new Map([
  ['background-color', 'yellow']
])

fetchW3Links()
  .then(links => augmentWithSearch(links))

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
function augmentWithSearch(links) {
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
  return link.href.split('/')
    .slice(-1)[0]
    .replace('.asp', '')
    .split('_');
}

/**
 * advertiseW3Link
 *
 * @param link
 * @returns {undefined}
 */
function advertiseW3Link(link) {
  let advertiseText = ' ← This is a W3 link.' 
  const suggestion = searchSuggestion(link);
  if (!!suggestion) advertiseText = advertiseText.concat(suggestion);
  const advertiseNode = document.createTextNode(advertiseText);
  link.appendChild(advertiseNode);
  setStyles(link, LINK_CSS);
}

function showEl(el) {
  el.style.display = 'block';
}

function hideEl(el) {
  el.style.display = 'none';
}

function setStyles(el, styleMap) {
  styleMap.forEach((val, key) => {
    el.style[key] = val;
  });
}

/**
 * Swap the W3 href with the MDN href
 *
 * @param link - original dom el
 */
function injectSearchBar(link) {
  const iframe = document.createElement('iframe');
  iframe.src = 'https://duckduckgo.com/search.html?prefill=Search DuckDuckGo';
  iframe.id = 'ddg__iframe';
  setStyles(iframe, IFRAME_CSS);
  link.addEventListener('mouseenter', () => showEl(iframe));
  link.addEventListener('mouseleave', () => hideEl(iframe));
  link.appendChild(iframe);
}

function searchSuggestion(link) { 
  const searchParts = partitionAndClean(link);
  return (searchParts[0] !== '') ? ` Suggested search: mozilla, ${searchParts.join(', ')}` : null;
}
