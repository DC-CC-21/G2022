function waterfallCode(){
  const query = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
  })
  console.log(query.photo)
}






var _location = window.location.pathname.split('/')
_location = _location[_location.length-1]

switch(_location){
  case 'waterfalls.html':
    waterfallCode()
    break;
}

console.log(window.location.href)
console.log(_location)
// library home js
document.getElementById(
  "lm"
).innerHTML = `Last Modified: ${document.lastModified}`;
