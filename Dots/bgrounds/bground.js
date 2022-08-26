let url = "bground.json";
let bigDiv = document.querySelector("#bgrounds");
let storage = localStorage.getItem("dots");
if (!storage) {
  storage = setLocalStorage(jsObject.themes[0].colors);
} else {
  storage = JSON.parse(storage);
}

fetch(url)
  .then((response) => response.json())
  .then((jsObject) => {
    console.log(jsObject);

    for (let i = 0; i < jsObject.bgrounds.length; i++) {
      let img = document.createElement("img");
      img.src = "../assets/money.png";
      img.alt = "money image";
      img.width = 25;
      img.height = 25;

      let monDiv = document.createElement("div");
      monDiv.classList.add("money");
      monDiv.append(img);

      let name = jsObject.bgrounds[i].name;
      let price = jsObject.bgrounds[i].price;
      let color = jsObject.bgrounds[i].color;
      let bgroundUrl = jsObject.bgrounds[i].url;

      let h2 = document.createElement("h2");
      h2.innerHTML = `${name} - ${price}`;
      h2.append(monDiv);
      bigDiv.append(h2);

      let bgroundImg;
      if (bgroundUrl != "") {
        let imgDiv = document.createElement("div");
        bgroundImg = document.createElement("img");

        imgDiv.classList.add("bgDiv");
        bgroundImg.src = bgroundUrl;
        bgroundImg.alt = name;
        bgroundImg.width = 100;
        bgroundImg.height = 100;

        imgDiv.append(bgroundImg);
        bigDiv.append(imgDiv);
        if (bgroundImg.src == storage.background) {
          bgroundImg.parentElement.classList.toggle("select");
        }
      } else {
        bgroundImg = document.createElement("div");

        bgroundImg.innerHTML = ".";
        bgroundImg.style.backgroundColor = `${color}`;
        bgroundImg.style.border = "2px solid green";
        bgroundImg.classList.add("bgDiv");
        if (color == storage.background) {
          bgroundImg.classList.toggle("select");
        }
        bigDiv.append(bgroundImg);
      }

      bgroundImg.addEventListener("click", (_) => {
        document
          .querySelectorAll(".select")
          .forEach((el) => el.classList.toggle("select"));
        if (bgroundImg.src) {
          bgroundImg.parentElement.classList.toggle("select");
          // console.log(bgroundImg.src);
          storage.background = bgroundImg.src;
        } else {
          bgroundImg.classList.toggle("select");
          storage.background = bgroundImg.style.backgroundColor;

          // console.log(bgroundImg.style.backgroundColor);
        }
        localStorage.setItem("dots", JSON.stringify(storage));
      });
    }
  });

function setLocalStorage(jsObject) {
  let data = {
    theme: jsObject,
    daily: "",
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
    background: "gray",
  };
  localStorage.setItem("dots", JSON.stringify(data));
  return data;
}
