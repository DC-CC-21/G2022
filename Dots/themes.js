let url = "./themes.json";
let bigDiv = document.querySelector("#themes");

fetch(url)
  .then((response) => response.json())
  .then((jsObject) => {
    for (let i = 0; i < jsObject.themes.length; i++) {
      console.log(jsObject.themes[i]);
      let name = jsObject.themes[i].name;
      let price = jsObject.themes[i].price;
      let colors = jsObject.themes[i].colors;

      let h2 = document.createElement("h2");
      // let p = document.createElement('p');
      let colDiv = document.createElement("div");
      colDiv.classList.add("colSet");

      colDiv.addEventListener('click', (e) => {
        document.querySelectorAll('.select').forEach(el => {
          el.classList.toggle('select');
        });
        colDiv.classList.toggle('select');
      })

      h2.innerHTML = `${name} - $${price}`;

      for (let j = 0; j < colors.length; j++) {
        let color = document.createElement("div");
        color.innerHTML = ".";
        color.style.backgroundColor = colors[j];
        colDiv.append(color);
      }
      bigDiv.append(h2, colDiv);
    }
  });
