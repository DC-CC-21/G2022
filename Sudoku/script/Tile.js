export class Tile {
  constructor(parent, x, y, value, size, highlightFn, contentValues) {
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.origValue = value;
    this.value = value;
    this.s = size;
    this.highlightFn = highlightFn;
    this.hasValue = true;
    this.currentValue = "";
    this.solid = true;
    this.content = contentValues
    this.tile = this.createTile();
  }

  // Tile setup
  createTile() {
    const div = document.createElement("div");
    div.setAttribute(
      "data",
      `${this.x},${this.y},${this.value}`
    );
    div.classList.add("tile");
    div.classList.add("solid");
    div.src = this.src;

    div.append(this.tileContent());
    this.parent.append(div);

    return div;
  }

  tileContent() {
    const div = document.createElement("div");
    div.classList.add("tileContent");

    console.log(this.c, this.value)
    div.innerText = this.content[this.value-1];
    div.addEventListener("click", this.tileClicked.bind(this));
    return div;
  }

  // Click handlers
  tileClicked() {
    let v = this.value > 0 ? this.value : null;
    this.highlightFn(this.y, this.x, v);
    this.tile.classList.add("tile-active");
  }

  // Highlights
  applyHighlight(highlightType) {
    this.tile.classList.add(`tile-${highlightType}`);
  }

  clearHighlight() {
    const classes = Array.from(this.tile.classList);
    classes.forEach((className) => {
      if (className.includes("tile-")) {
        this.tile.classList.remove(className);
      }
    });
  }

  // Setters
  setHidden() {
    this.tile.children[0].innerText = "";
    this.tile.classList.remove("solid");
    this.value = 0;
    this.solid = false;
    // this.tile.children[0].setAttribute(
    //   "contenteditable",
    //   "true"
    // );
  }

  setValue(v) {
    if (this.solid) return;
    this.value = v;
    this.tile.children[0].innerText = this.content[v-1]||"";
  }

  setIncorrect() {
    this.tile.classList.add("tile-incorrect");
  }

  setInactive() {
    this.clearHighlight();
  }
}
