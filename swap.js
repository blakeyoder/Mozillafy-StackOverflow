const W3_REGEX = 'https?:\/\/(www\.)?w3schools\.com\/*';
const DDG_URI = 'https://api.duckduckgo.com/?q={QUERY}&format=json';

fetchW3Links()
  .then(links => replaceWithMDN(links))

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

function partitionAndClean(link) {
  let parts = [];
  return link.href.split('/')
    .slice(-1)[0]
    .split('_')
    .slice(-1)[0]
    .replace('.asp', '')
}

function injectIntoDOM(link, mdnLink) {
  link.href = mdnLink.AbstractURL;
  return;
}
