console.clear();

//HTML elements
const nodeContainer = document.getElementById("displayNodes");
const addNodeDisplay = document.getElementById("addNodeDisplay");
const colorDisplay = document.querySelector("#displayColor");

//layout
const width = document.querySelector("input[name=width]");
const height = document.querySelector("input[name=height]");
const spacing = document.querySelector("input[name=spacing]");
const backgroundColor = document.querySelector("input[name=bg]");

let addNodeBtn = document.getElementById("addNode");
let inputs = document.querySelectorAll("#addNodeDisplay input");
//constants
const prefix = ["Name", "Node End", "Value", "Color"];
const data = {
  type: "sankey",
  orientation: "h",
  node: {
    pad: 15,
    thickness: 30,
    line: {
      color: "black",
      width: 1,
    },
    label: [],
    color: [],
  },

  link: {
    source: [],
    target: [],
    value: [],
    color: [],
  },
};
const layout = {
  title: "",
  font: {
    size: 10,
  },
  width: 400,
  height: 400,
  plot_bgcolor: "white",
  paper_bgcolor: "white",
};

//EVENT LISTENERS

// check if inputs have changed
inputs[0].addEventListener("keyup", () => {
  checkValues();
});
inputs[3].addEventListener("change", () => {
  checkValues();
});

//event listener for button
addNodeBtn.addEventListener(
  "click",
  () => {
    let empty = checkEmpty();
    if (checkEmpty > 0) {
      alert(`You have ${empty} empty values, please fill them in to continue`);
      return;
    }

    updateHTML();
    updateNodes();
    console.log(data);
    createChart(data, layout);

    emptyInputs();
  },
  false
);

width.addEventListner("change", () => {
  layout.width = width.value;
  createChart(data, layout);
});
height.addEventListner("change", () => {
  layout.height = height.value;
  createChart(data, layout);
});
backgroundColor.addEventListner("change", () => {
  layout.plot_bgcolor = backgroundColor.value;
  layout.paper_bgcolor = backgroundColor.value;
  createChart(data, layout);
});
spacing.addEventListner("change", () => {
  data.node.pad = spacing.value;
  createChart(data, layout);
});
//add node
function updateHTML() {
  let newNode = document.createElement("div");
  newNode.setAttribute("class", "newNodes");

  inputs.forEach((input, idx) => {
    let p = document.createElement("p");
    p.innerHTML = `${prefix[idx]}: ${input.value}`;
    newNode.append(p);
  });
  nodeContainer.append(newNode);
}

//update chart
function updateNodes() {
  let label = inputs[0].value;
  let end = inputs[1].value;
  let value = inputs[2].value;
  let color = inputs[3].value;

  //add label if not already in data
  if (data.node.label.includes(label)) {
    let idx = data.node.label.indexOf(label);
    if (data.node.color[idx] == "#000") {
      data.link.color.push(color + "32");
    } else {
      data.link.color.splice(idx, 1, color + "32");
    }
    data.node.color.splice(idx, 1, color);
  } else {
    data.node.label.push(label);
    data.node.color.push(color);
    data.link.color.push(color + "32");
  }

  //add target label if not already in data
  if (data.node.label.includes(end)) {
  } else {
    data.node.label.push(end);
    data.node.color.push("#000");
    // data.link.color.push('#00000032')
  }

  data.link.value.push(value);
  data.link.source.push(data.node.label.indexOf(label));
  data.link.target.push(data.node.label.indexOf(end));
}

//check if value exists
function checkValues() {
  let label = inputs[0].value;

  //if value exists set color value to existing color and disable it
  if (data.node.label.includes(label)) {
    let idx = data.node.label.indexOf(label);
    inputs[3].value = data.node.color[idx];
    inputs[3].disabled = true;
  } else {
    inputs[3].disabled = false;
  }
}

function checkEmpty() {
  let empty = 0;
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value == "") {
      empty += 1;
    }
  }
  return empty;
}

function emptyInputs() {
  inputs.forEach((input) => (input.value = ""));
  inputs[0].focus();
}


function addNode(currentIdx){
  let idxs = [];
  for(let i = 0; i < node.target.length; i ++){
      if(node.target[i] == currentIdx){
          idxs.push(i);
      }
  }
  return idxs
}

function addValues(arr){
  let val = 0
  for(let i = 0; i < arr.length; i ++){
      val += node.values[arr[i]]
  }
  return val
}
