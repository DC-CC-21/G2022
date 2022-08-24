let url = "./themes.json";
let bigDiv = document.querySelector("#themes");
    let storage = localStorage.getItem('dots')
    if(!storage){
      storage = setLocalStorage(jsObject.themes[0].colors)
    } else {
      storage = JSON.parse(storage)
    }
fetch(url)
  .then((response) => response.json())
  .then((jsObject) => {


    console.log(jsObject.themes[0].colors);
    for (let i = 0; i < jsObject.themes.length; i++) {
      let name = jsObject.themes[i].name;
      let price = jsObject.themes[i].price;
      let colors = jsObject.themes[i].colors;

      let h2 = document.createElement("h2");
      // let p = document.createElement('p');
      let colDiv = document.createElement("div");
      colDiv.classList.add("colSet");

      colDiv.addEventListener("click", (e) => {
        document.querySelectorAll(".select").forEach((el) => {
          el.classList.toggle("select");
        });
        colDiv.classList.toggle("select");
        storage.theme = jsObject.themes[i].colors
        localStorage.setItem('dots', JSON.stringify(storage))
      });

      h2.innerHTML = `${name} - $${price}`;

      for (let j = 0; j < colors.length; j++) {
        let color = document.createElement("div");
        color.innerHTML = "A";
        color.style.backgroundColor = colors[j];
        colDiv.append(color);
      }
      bigDiv.append(h2, colDiv);
    }
  });

function setLocalStorage(jsObject) {
  let data = {
    theme: jsObject,
    daily:'',
    levelsBeat: {
      x4: new Array(100).fill(0),
      x5: new Array(100).fill(0),
      x6: new Array(100).fill(0),
      x7: new Array(100).fill(0),
      x8: new Array(100).fill(0),
      x9: new Array(100).fill(0),
      x10: new Array(100).fill(0),
      x11: new Array(100).fill(0),
      x12: new Array(100).fill(0),
      x15: new Array(100).fill(0),
    },
  };
  localStorage.setItem("dots", JSON.stringify(data));
  return data;
}

let check = document.querySelector('input')
check.checked = storage.colorblind
check.onchange = function(){
  console.log(check.checked)
  storage.colorblind = check.checked;
  localStorage.setItem('dots', JSON.stringify(storage))
} 