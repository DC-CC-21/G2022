fetch("/G2022/Pac-man/imgs.json").then(function (response) {
  return response.json();
}).then(function (jsonObject) {
  Object.keys(jsonObject).forEach(key=>{
    let container = document.getElementById(key)
    jsonObject[key].forEach(value=>{
      let element = document.createElement('img')
      element.src = value
      container.append(element)
    })
  })
  
});