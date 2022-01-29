Object.defineProperty(String.prototype, "toTitleCase", {
  value: function toTitleCase() {
    return [this.slice(0, 1).toUpperCase(), this.slice(1, this.length)].join(
      ""
    );
  },
  writable: true,
  configurable: true,
});

const pic = document.getElementById("img");
let search = window.location.search;
let folder;
let path;
search = search.slice(1, search.length).toTitleCase();
console.log(search);
if (search === "Custom") {
  var yourImg = document.getElementById('choosefile')
  yourImg.style.display = 'flex'
  yourImg.addEventListener('submit',(e)=>{
    console.log('clicked')
  })

} else {
  folder = search.slice(0, search.length - 1);
  path = `./assets/${folder}s/${search}.svg`;
}
pic.src = path;

//index2.html
document.getElementById("start").addEventListener("click", () => {
  let numberofPieces = document.getElementsByName("numberOfPieces");

  for (var i = 0; i < numberofPieces.length; i++) {
    console.log(numberofPieces[i].value);
    if (numberofPieces[i].checked) {
      var difficulty = ~~Number(numberofPieces[i].value);
      break;
    }
  }
  window.location = `index3.html?${search}:${difficulty}`;
});
