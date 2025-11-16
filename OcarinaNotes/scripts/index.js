// === ELEMENTS === //
const accidentals = document.querySelectorAll(".accidentals");
const keyboard = document.getElementById("keyboard");
const keyboardChildren = Array.from(keyboard.children);
const container = document.getElementById("canvas-container");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// === FUNCTIONS === //
function maximizeCanvas() {
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  canvas.style.width = canvas.width + "px";
  canvas.style.height = canvas.height + "px";
}

maximizeCanvas();

class SheetMusic {
  notes = [];
  notesPerStaff = 10;
  noteIndices = "cdefgab";
  staffLineSpacing = 10;
  staffSpacing = 150;
  staffYStart = 100;
  staffPadding = 0.95;
  images = {};
  accidental = "";
  noteHeight;

  constructor(kwargs) {
    Object.assign(this, kwargs);
    this.staffWidth = this.staffPadding * canvas.width;
    this.staffOffsetX = (canvas.width - this.staffWidth) / 2;
    this.noteOffsetX = this.staffWidth * 0.06;
    this.noteSpacing = (this.staffWidth * 0.9 - 5) / (this.notesPerStaff - 1);
    this.noteHeight = this.staffLineSpacing / 2.2;
    this.loadImages();
  }

  loadImages() {
    // Load images
    this.images = {
      // Set 1
      c: new Image(),
      d: new Image(),
      e: new Image(),
      f: new Image(),
      g: new Image(),
      a: new Image(),
      b: new Image(),

      // Set 2
      c2: new Image(),
      d2: new Image(),
      e2: new Image(),

      // # and flats
      cs: new Image(),
      ds: new Image(),
      fs: new Image(),
      gs: new Image(),
      as: new Image(),
      cs2: new Image(),
      ds2: new Image(),
    };

    // Loop through each of the keys to locate the correct image
    Object.keys(this.images).forEach((note) => {
      // note comes in as "c2" or "cs2" and needs to be converted to "C2" or "C2+"
      const letter = note[0].toUpperCase();
      const accidental = note?.[1]?.replace("s", "+") || "";
      const number = note?.[2] || "";
      console.log(note, letter, number, accidental);
      this.images[
        note
      ].src = `./images/fingering_${letter}${number}${accidental}.png`;
      this.images[note].onerror = () => (this.images[note].success = false);
      this.images[note].onload = () => (this.images[note].success = true);
    });
  }

  getNotePosition(noteLetter, index) {
    const [noteName, octave, accidental] = noteLetter.split("");

    // Use Modulo to wrap the notes around when they reach the end of the staff
    const noteX = index % this.notesPerStaff;

    // Get the staff number and multiply it by the staff line spacing
    const staffNumber = ~~(index / this.notesPerStaff) * this.staffSpacing;

    // Space the notes based on their index and divide by two to allow for steps notes to land on both lines and spaces
    const noteToSpacing =
      (this.noteIndices.indexOf(noteName) * this.staffLineSpacing) / 2;

    // Because the staff lines are 10px apart and render from the top down, we need to subtract the number of staff lines minus one to translate the notes to the correct place
    const noteOffsetY = 4.5 * this.staffLineSpacing;

    // Move the note to the correct octave on the staff with middle c being the lowest
    const octaveOffset = octave * this.staffLineSpacing * 3.5;

    const noteY =
      this.staffYStart -
      noteToSpacing +
      noteOffsetY +
      staffNumber -
      octaveOffset;
    return {
      x: noteX * this.noteSpacing + this.noteOffsetX,
      y: noteY + this.noteHeight,
      accidental: accidental,
      staffPosition: staffNumber + this.staffLineSpacing * 10,
    };
  }

  renderNote(note, noteIndex) {
    let { x, y, accidental, staffPosition } = this.getNotePosition(
      note,
      noteIndex
    );

    // Get the note letter
    let noteLetter = note[0];

    // Get the octave number "0", "1"
    let octave = note[1];

    // Replace sharps with "s" to match the image format
    if (accidental === "#" && !noteLetter.match(/[eb]/g)) {
      noteLetter += "s";
    } else if (accidental === "-" && !noteLetter.match(/[cf]/g)) {
      noteLetter = this.noteIndices[this.noteIndices.indexOf(noteLetter) - 1];
      noteLetter += "s";
    } else {
      accidental = "";
    }

    ctx.font = `15px Arial`;
    const accidentalX = x - this.noteHeight - 12;
    const accidentalY = y + this.noteHeight * 0.8;
    if (accidental === "#") {
      ctx.fillStyle = "#0000d3";
      ctx.fillText("#", accidentalX, accidentalY);
    } else if (accidental === "-") {
      ctx.fillStyle = "#cf0000";
      ctx.fillText("b", accidentalX, accidentalY);
    } else {
      ctx.fillStyle = "black";
    }

    ctx.beginPath();
    ctx.fillRect(
      x + this.noteHeight * 1.5 - 2,
      y,
      2,
      -(this.notesPerStaff * this.noteHeight)
    );
    ctx.ellipse(
      x,
      y,
      this.noteHeight * 1.5,
      this.noteHeight,
      0,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Replace octave 1 with 2 to match image format and remove 0s
    if (octave === "0") {
      octave = "";
    } else if (octave === "1") {
      octave = "2";
    }
    noteLetter += octave;

    console.log(noteLetter, this.images[noteLetter].success);
    if (this.images[noteLetter].success) {
      ctx.drawImage(
        this.images[noteLetter],
        x - this.noteSpacing * 0.2,
        staffPosition - this.noteSpacing * 0.8,
        this.noteSpacing * 0.7,
        this.noteSpacing * 0.8
      );
    }
  }

  drawStaffLine(index) {
    ctx.beginPath();
    ctx.moveTo(this.staffOffsetX, index);
    ctx.lineTo(this.staffOffsetX + this.staffWidth, index);
    ctx.stroke();
  }

  drawStaff(staffIndex) {
    for (let i = 0; i < 5; i += 1) {
      this.drawStaffLine(staffIndex + i * this.staffLineSpacing);
    }
  }

  render() {
    ctx.fillStyle = "cornsilk";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw the staff
    for (
      let i = 0;
      i < (Math.ceil(this.notes.length / this.notesPerStaff) || 1);
      i++
    ) {
      this.drawStaff(this.staffYStart + this.staffSpacing * i);
    }
    this.notes.forEach(this.renderNote.bind(this));
  }
}

class Cursor {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.lastOn = new Date();
  }

  render() {
    ctx.fillStyle = "rgba(99, 237, 255, 0.5)";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

const music = new SheetMusic({
  notesPerStaff: Math.floor(window.innerWidth / 80),
});

const cursor = new Cursor(0, 0, 10, 100);
console.log(music.notes);

// === CONSTANTS === //
// const NOTE_INDICES = "cdefgab";
// const NOTES_PER_STAFF = 10;
// const PADDING = 0.95;
// const LINE_SPACING = 10;
// const STAFF_SPACING = 120;
// const NOTE_SPACING = 50;
// const STAFF_Y_START = 100;
const notes2 = [];

music.notes = notes2;

// === MAIN === //
function draw() {
  // for (let i = 0; i < Math.ceil(notes.length / NOTES_PER_STAFF) + 1; i++) {
  //   drawStaff(STAFF_Y_START + STAFF_SPACING * i, PADDING, LINE_SPACING);
  // }

  music.render();
  cursor.render();
  // notes.forEach(drawNote);
  // drawCursor();
  // requestAnimationFrame(draw);
}

draw();

// === EVENT LISTENERS === //
keyboard.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "span") {
    if (e.target.textContent.match(/#|-/)) {
      // accidentals.forEach((accidental) => {
      //   accidental.classList.remove("active");
      // });
      // e.target.classList.add("active");

      let lastNote = music.notes.pop();
      lastNote += e.target.textContent;
      music.notes.push(lastNote);
      draw();
    } else if (e.target.textContent === "Del") {
      music.notes.pop();
      draw();
    } else {
      const targetSpan = e.target;
      const index = keyboardChildren.indexOf(targetSpan);
      const octave = ~~(index / 7);
      console.log(
        `${music.noteIndices[index % 7]}${octave}${music.accidental}`
      );
      music.notes.push(
        `${music.noteIndices[index % 7]}${octave}${music.accidental}`
      );

      // accidentals.forEach((accidental) => {
      //   accidental.classList.remove("active");
      // });
      music.accidental = "";
      draw();
    }
  }
});
