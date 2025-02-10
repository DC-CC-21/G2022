export default class SudokuStorage {
  constructor() {
    this.data = this.getData();
    if (!this.data) this.setData();
  }

  getData() {
    let storageData = JSON.parse(localStorage.getItem("sudoku"));
    if (!storageData) {
      storageData = {
        images: {},
      };
      this.data = storageData
      this.setData()
    }

    return storageData;
  }

  setData() {
    localStorage.setItem("sudoku", JSON.stringify(this.data));
  }

  addImage(setNum, b64) {
    console.log(b64.length, setNum);
    if (!Array.isArray(this.data.images?.[setNum])) {
      console.log(this)
      this.data.images[setNum] = [];
    }
    this.data.images[setNum].push(b64);
    this.setData()
  }
}
