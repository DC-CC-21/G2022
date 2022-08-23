let select = document.querySelector(".gridSize");

for (let i = 3; i < 16; i++) {
  let option = document.createElement("option");

  option.innerHTML = `${i} x ${i}`;
  select.append(option);
}


document.querySelector("form").addEventListener("change", () => {
  document.querySelectorAll("input").forEach((input, index) => {
    constrainValues(input);
  });
});
document.querySelector("form").addEventListener("keyup", (e) => {
  document.querySelectorAll("input").forEach((input, index) => {
    constrainValues(input, e.key);
  });
});

document.getElementById("play").addEventListener("click", (_) => {
    let search = []
      document.querySelectorAll("input").forEach((input, index) => {
    document.getElementById("play").removeAttribute("href");
    console.log(input.value);
    if (input.value == "") {
      let a = document.getElementById("a");
      a.style.display = "block";
      a.innerHTML = "Please fill out all fields";
      return;
    }


    if(index == 0){search.push('?'+input.name+'='+constrainValues(input))}
    else {search.push(input.name+'='+constrainValues(input))}
    document.getElementById('play').style.color = 'blue'
    console.log(search.join('&'))
    document.getElementById('play').href = 'play.html'+search.join('&')+'&1level=custom&grid='+select.value.split(' ')[0]

  });
});

function constrainValues(input, key) {
  switch (input.name) {
    case "cards":
      return constrain(input.value, 2, 15);
    case "dots":
      let grid = Number(input.value.split(" ")[0]);
      return constrain(input.value, 2, grid * grid);
    case "colors":
      return constrain(input.value, 2, 8);
  }
}

function constrain(aNumber, aMin, aMax) {
  return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;
}
