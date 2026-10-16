export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;

// get the pending-command list and the Run/Clear buttons from the HTML.
const commandList = document.querySelector<HTMLUListElement>("#rover-queue")!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;

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
  label: string;
  execute: () => void;
};

// Store commands here until the operator chooses Run.
const commandQueue: Command[] = [];

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

// Display the queued commands in order and update the buttons.
function updateCommandList() {
  commandList.replaceChildren();

  for (const command of commandQueue) {
    const item = document.createElement("li");
    item.textContent = command.label;
    commandList.appendChild(item);
  }

  runButton.disabled = commandQueue.length === 0;
  clearButton.disabled = commandQueue.length === 0;
}

// Add a command to the queue without executing it.
function enqueueCommand(command: Command) {
  commandQueue.push(command);
  updateCommandList();
}

// Move one grid cell forward using the current direction's offsets.
const forwardCommand: Command = {
  label: "Forward",
  execute: () => {
    // apply one shared movement rule instead of four direction branches.
    const currentDirection = directions[direction];
    x = Math.max(0, Math.min(4, x + currentDirection.dx));
    y = Math.max(0, Math.min(4, y + currentDirection.dy));
  },
};

const rightCommand: Command = {
  label: "Right",
  // Turn the rover 90 degrees clockwise.
  execute: () => {
    // Advance to the next direction, wrapping back to North after West.
    direction = (direction + 1) % directions.length;
  },
};

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  enqueueCommand(forwardCommand);
};

document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  enqueueCommand(rightCommand);
};

// Run commands in fifo order, then empty the queue and redraw the rover.
runButton.onclick = () => {
  while (commandQueue.length > 0) {
    const command = commandQueue.shift()!;
    command.execute();
  }

  updateCommandList();
  drawRover();
};

//we want to clear pending commands without moving or turning the rover.
clearButton.onclick = () => {
  commandQueue.length = 0;
  updateCommandList();
};

// Reset the rover immediately and discard any pending commands.
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  commandQueue.length = 0;
  updateCommandList();
  drawRover();
};

updateCommandList();
drawRover();
