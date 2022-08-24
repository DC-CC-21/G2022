let url = "bground.json";
let bigDiv = document.querySelector("#bgrounds");

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

      if (bgroundUrl != "") {
        let imgDiv = document.createElement("div");
        let bgroundImg = document.createElement("img");

        imgDiv.classList.add("bgDiv");
        bgroundImg.src = bgroundUrl;
        bgroundImg.alt = name;
        bgroundImg.width = 100;
        bgroundImg.height = 100;

        imgDiv.append(bgroundImg);
        bigDiv.append(imgDiv);
      } else {
        let bgroundDiv = document.createElement("div");
        bgroundDiv.innerHTML = ".";
        bgroundDiv.style.backgroundColor = `${color}`;
        bgroundDiv.style.border = '2px solid green'
        bgroundDiv.classList.add("bgDiv");
        bigDiv.append(bgroundDiv);
      }
    }
  });
