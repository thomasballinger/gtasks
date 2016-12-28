const sorted = require('./util.js').sorted;
const parseAuthKV = require('./util.js').parseAuthKV;

const arrayEquals = (a, b) => {
  if (a.length !== b.length){ return false; }
  for (var i = 0; i < a.length; i++){
    if (a[i] !== b[i]){ return false; }
  }
  return true;
}
const objectEquals = (a, b) => {
  if (Object.keys(a).length !== Object.keys(b).length){ return false; }
  for (var key of [].concat(Object.keys(a), Object.keys(b))){
    if (a[key] !== b[key]){ return false; }
  }
  return true
}
const assertEqual = (a, b, msg) => {
  if (msg === undefined){
    msg = 'not equal';
  }
  if (Array.isArray(a) && Array.isArray(b)){
    if (arrayEquals(a, b)){
      return true;
    }
  } else if (typeof a === 'object' && typeof b === 'object'){
    if (objectEquals(a, b)){
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

describe('testing machinery', () => {
  it('assertEqual', () => {
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
  });
  it('objectEquals', ()=>{
    assertEqual(true, objectEquals({a: 1}, {a: 1}));
    assertEqual(false, objectEquals({a: 1}, {a: 2}));
  });
});

describe('sorted', ()=>{
  it("doesn't modify original", () => {
    const orig = ['asdf', 'z', 'qwqwe', 'cv', 'wer'];
    const copy = orig.slice();
    const after = sorted(orig, (x)=>x.length);

    assertEqual(orig, ['asdf', 'z', 'qwqwe', 'cv', 'wer']);
    assertEqual(after, ['z', 'cv', 'wer', 'asdf', 'qwqwe']);
  });
});

describe('parseAuthKV', ()=>{
  it('works for good strings', ()=>{
    assertEqual(parseAuthKV("abc = 'def'"), {
      key: 'abc',
      value: 'def'
    });
  });
});
