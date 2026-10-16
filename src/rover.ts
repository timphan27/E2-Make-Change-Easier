export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;

// Store each direction's name and movement offsets together.
type DirectionRecord = {
  name: string;
  dx: number;
  dy: number;
};

const directions: DirectionRecord[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

let x = 2;
let y = 2;
let direction = 0;

// A command defines an action the rover can execute.
type Command = {
  execute: () => void;
};

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // get the heading name from the current direction record.
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].name
  }`;
}

// Move one grid cell forward using the current direction's offsets.
const forwardCommand: Command = {
  execute: () => {
    // apply one shared movement rule instead of four direction branches.
    const currentDirection = directions[direction];
    x = Math.max(0, Math.min(4, x + currentDirection.dx));
    y = Math.max(0, Math.min(4, y + currentDirection.dy));
  },
};

const rightCommand: Command = {
  // Turn the rover 90 degrees clockwise.
  execute: () => {
    // Advance to the next direction, wrapping back to North after West.
    direction = (direction + 1) % directions.length;
  },
};

// The invoker executes a command without choosing its behavior by label.
document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  forwardCommand.execute();
  drawRover();
};

document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  rightCommand.execute();
  drawRover();
};

document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  drawRover();
};

drawRover();
