function puzzleSelectorCode() {
  const query = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let container = document.getElementById("imgContainer");
  let folder = query.type;
  let path = folder;

  document.querySelector("header h1").innerHTML = folder;

  if (folder.slice(folder.length - 1, folder.length) === "s") {
    path = path.slice(0, folder.length - 1);
  }
  for (let i = 0; i < 10; i++) {
    console.log(folder);
    console.log(path);
    //create image
    let img = document.createElement("img");
    img.src = `/G2022/Puzzle/assets/${folder}/${path}${i + 1}.svg`;
    img.setAttribute("class", "imgs");

    //put image into created div
    let div = document.createElement("div");
    div.append(img);

    // put div with image inside an html a tag
    let a = document.createElement("a");
    a.href = href = `pieceSetup.html?${path}${i + 1}`;
    a.append(div);

    container.append(a);
  }
}

var _location = window.location.pathname.split("/");
_location = _location[_location.length - 1];

//choose what js code to run
switch (_location) {
  case "puzzleSelector.html":
    puzzleSelectorCode()
    break;
}

// library home js
document.getElementById(
  "lm"
).innerHTML = `Last Modified: ${document.lastModified}`;
