const sorted = (arr, key, reverse) => {
  if (reverse === undefined){ reverse = false; }
  const withIndices = arr.map(v => [key(v), v]);
  if (reverse){
    withIndices.sort( (a, b) => b[0] - a[0])
  } else {
    withIndices.sort( (a, b) => a[0] - b[0])
  }
  return withIndices.map(pair => pair[1]);
}

module.exports.sorted = sorted;
