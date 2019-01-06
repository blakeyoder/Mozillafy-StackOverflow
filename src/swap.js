const W3_REGEX = 'https?:\/\/(www\.)?w3schools\.com\/*';

const link_css = new Map([
  ['background-color', 'yellow'],
]);
const badge_css = new Map([
  ['width', '45px'],
  ['text-align', 'center'],
  ['border-radius', '10px'],
  ['background-color', '#c4dd62'],
  ['box-shadow',  '2px 2px 5px black'],
  ['margin-bottom',  '8px'],
]);

// fetch all links within post texts and flatten out to only an a tag array
const post_links = Array.prototype.reduce.call(document.getElementsByClassName('post-text'),
  (acc, post_link) => { 
    const links = post_link.getElementsByTagName('a');
    Array.prototype.map.call(links, link => acc.push(link));
    return acc;
}, []);

fetchW3Links()
  .then(links => buildBadge(links))
  .then(links => {
    links.forEach(link => {
      advertiseW3Link(link);
    })
  });

/**
 * Iterate over all links on the page and return only 
 * those that match the W3 regex
 *
 * @returns {Promise} array of W3 links
 */
function fetchW3Links() {
  return new Promise(resolve => {
    const w3_links = [];
    post_links.forEach(link => {
      if (link.href.match(W3_REGEX)) {
        w3_links.push(link);
      }
    });
    resolve(w3_links);
  });
}

/**
 * Returns a badge with the percentage of post links
 * that link to a w3 schools resource
 *
 * @param links
 * @returns {array} original parameter for use in the promise chain
 */
function buildBadge(links) {
  if (post_links.length !== 0) {
    const percentage = Math.floor((links.length / post_links.length) * 100)
    const headerEl = document.getElementById('question-header');
    const badgeEl = document.createElement('div');
    const badgeText = document.createTextNode(`${percentage}%`);
    setStyles(badgeEl, badge_css);
    badgeEl.appendChild(badgeText);
    headerEl.parentNode.insertBefore(badgeEl, headerEl);
  }
  return links;
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
 * Highlight link in page
 *
 * @param link
 * @returns {undefined}
 */
function advertiseW3Link(link) {
  let advertiseText = ' ← This is a W3 link.' 
  const suggestion = searchSuggestion(link);
  const advertiseNode = document.createTextNode(advertiseText);
  link.appendChild(advertiseNode);
  setStyles(link, link_css);
}

function setStyles(el, styleMap) {
  styleMap.forEach((val, key) => {
    el.style[key] = val;
  });
}

function searchSuggestion(link) { 
  const searchParts = partitionAndClean(link);
  return (searchParts[0] !== '') ? ` Suggested search: mozilla, ${searchParts.join(', ')}` : null;
}
