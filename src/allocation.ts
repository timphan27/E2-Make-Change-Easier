export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

let assignedCrew = 2;

// extract the crew drawing into a helper.
function drawCrewMembers() {
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < assignedCrew ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < assignedCrew ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function updateAllocation() {
  const production = assignedCrew * 3;
  const consumption = 6;
  const balance = production - consumption;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Call the extracted helper instead of repeating the drawing logic.
  drawCrewMembers();

  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${assignedCrew} / 6`, 18, 76);
  ctx.fillText(`Production: ${production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, consumption * 14, 20);

  readout.textContent =
    `Assigned: ${assignedCrew}/6 · Production: ${production} · Consumption: ${consumption} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  assignedCrew = Math.max(0, assignedCrew - 1);
  updateAllocation();
};

document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  assignedCrew = Math.min(6, assignedCrew + 1);
  updateAllocation();
};

document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    assignedCrew = 2;
    updateAllocation();
  };

updateAllocation();
