let search = window.location.search.split("=");
console.log(search)
const container = document.getElementById('levels')
fetch("./assets/levels.json")
  .then((response) => response.json())
  .then((jsObject) => {
    jsObject = jsObject[search[1]]
    for(let i = 0; i < 100; i ++){
        let el = document.createElement('a')
        el.href = `play.html?gridSize=${search[1]}&level=${i}`
        el.innerHTML = i;
        container.append(el)
    }
  });
