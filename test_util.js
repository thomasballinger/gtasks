(function testSorted(){
  const arrayEquals = (a, b) => {
    if (a.length !== b.length){ return false; }
    for (var i = 0; i < a.length; i++){
      if (a[i] !== b[i]){ return false; }
    }
    return true;
  }
  const assertEqual = (a, b, msg) => {
    if (msg === undefined){
      msg = 'not equal';
    }
    if (Array.isArray(a) && Array.isArray(b)){
      if (arrayEquals(a, b)){
        return true;
      }
    } else {
      if (a === b){
        return true;
      }
    }
    console.log(msg, a, b);
    throw Error(msg+': '+a+b);
  }
  assertEqual(1, 1);
  var working = false;
  try {
    assertEqual(['a', 'b'], ['a', 'c']);
  } catch (e){
    working = true;
  }
  if (!working){
    throw "assertEquals doens't work";
  }

  const orig = ['asdf', 'z', 'qwqwe', 'cv', 'wer'];
  const copy = orig.slice();
  const after = sorted(orig, (x)=>x.length);

  assertEqual(after, ['z', 'cv', 'wer', 'asdf', 'qwqwe']);
  assertEqual(after, ['z', 'cv', 'wer', 'asdf', 'qwqwe']);

})();
