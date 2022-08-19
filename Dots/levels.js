let levels = document.getElementById("levels");
let smallest =
  window.innerHeight > window.innerWidth
    ? window.innerWidth
    : window.innerHeight;

let search = window.location.search.split("=");
document.getElementById("grid").innerHTML = search[1] + "x" + search[1];

fetch(`./json/x${search[1]}.json`)
  .then((response) => response.json())
  .then((jsObject) => {
    console.log(jsObject)
    for (let i = 0; i < jsObject.length; i++) {
      createElement(i + 1);
    }
  });

function createElement(i) {
  let el = document.createElement("a");
  el.innerHTML = i;
  el.href = `play.html?grid=${search[1]}&level=${i - 1}`;

  let completeLevels = JSON.parse(localStorage.getItem("dots"));
  if (!completeLevels) {
    completeLevels = setLocalStorage();
  }
  if (completeLevels.levelsBeat["x" + search[1]][i-1]) {
    el.setAttribute("class", "complete");
    let p = document.createElement("p");
    p.innerHTML = "Complete";
    el.append(p);
  }

  el.style.width = smallest * 0.1 + "px";
  el.style.height = smallest * 0.1 + "px";
  levels.append(el);
}
function setLocalStorage() {
  let data = {
    theme: [
      "#ff0000",
      "#0abcda",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#00ffff",
      "#00aaff",
      "#ffaa00",
    ],
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
  return data
}
