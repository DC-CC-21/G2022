function waterfallCode() {
  const query = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  // let imgs = document.querySelectorAll('.imgs')
  // for(let i = 0; i < imgs.length; i ++){
  //   let folder = query.type
  //   let path = folder
  //   if(folder.slice(folder.length-1, folder.length) === 's'){
  //     path = path.slice(0,folder.length-1)
  //   }
  //   console.log(folder)
  //   console.log(path)
  //   imgs[i].src = `/G2022/Puzzle/assets/${folder}/${path}${i+1}.svg`
  // }
  let container = document.getElementById('imgContainer')
  for (let i = 0; i < 10; i++) {
    let folder = query.type;
    let path = folder;
    if (folder.slice(folder.length - 1, folder.length) === "s") {
      path = path.slice(0, folder.length - 1);
    }
    console.log(folder);
    console.log(path);
    // imgs[i].src = `/G2022/Puzzle/assets/${folder}/${path}${i+1}.svg`
    let img = document.createElement("img");
    img.src = `/G2022/Puzzle/assets/${folder}/${path}${i+1}.svg`
    
    let div = document.createElement('div')
    div.append(img)

    let a = document.createElement('a')
    a.href = href=`pieceSetup.html?${path}${i+1}`
    a.append(div)
    
    container.append(a)
  }
}

var _location = window.location.pathname.split("/");
_location = _location[_location.length - 1];

//choose what js code to run
switch (_location) {
  case "puzzleSelector.html":
    waterfallCode();
    break;
}

// library home js
document.getElementById(
  "lm"
).innerHTML = `Last Modified: ${document.lastModified}`;
