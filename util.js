const sorted = (arr, key, reverse) => {
  if (reverse === undefined){ reverse = false; }
  const withIndices = arr.map(v => [key(v), v]);
  if (reverse){
    withIndices.sort( (a, b) => b[0] - a[0] )
  } else {
    withIndices.sort( (a, b) => a[0] - b[0] )
  }
  return withIndices.map(pair => pair[1]);
}

/** Returns a promise with user's IP */
const ipAddress = () =>
  //TODO use a less server-y version, apparently webrtc can do this
  // see http://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript-only
  fetch('https://ipinfo.io/json')
    .then(resp => resp.json())
    .then(data => data.ip)


const parseAuthKV = (s) => {
  const parts = s.split(" = ");
  if (parts.length !== 2){
    throw Error('bad KV string: ' + s)
  }
  if (!(parts[1][0] === "'" && parts[1][parts[1].length-1] === "'")){
    throw Error('value not quoted: '+parts[1]);
  }
  const key = parts[0];
  const value = parts[1].slice(1, -1);
  return { key: key, value: value };
}

module.exports.sorted = sorted;
module.exports.ipAddress = ipAddress;
module.exports.parseAuthKV = parseAuthKV;
