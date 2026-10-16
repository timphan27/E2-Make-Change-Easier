export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

let assignedCrew = 2;

// this defines the type of data returned for one shift
type ShiftResults = {
  assignedCrew: number;
  production: number;
  consumption: number;
  balance: number;
};

// This function only calculates values and returns them in an object.
function calculateShiftResults(crewCount: number): ShiftResults {
  const production = crewCount * 3;
  const consumption = 6;
  const balance = production - consumption;

  return {
    assignedCrew: crewCount,
    production,
    consumption,
    balance,
  };
}

// Draw the six crew members, using the assigned count from the results.
function drawCrewMembers(results: ShiftResults) {
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < results.assignedCrew ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < results.assignedCrew ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

// It receives calculated results instead of calculating production itself.
function renderAllocationGraphic(results: ShiftResults) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCrewMembers(results);

  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${results.assignedCrew} / 6`, 18, 76);
  ctx.fillText(`Production: ${results.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, results.production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${results.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, results.consumption * 14, 20);
}

// this renderer formats the numerical report using the same results.
function renderReadout(results: ShiftResults) {
  readout.textContent =
    `Assigned: ${results.assignedCrew}/6 · Production: ${results.production} · Consumption: ${results.consumption} · Balance: ${
      results.balance > 0 ? "+" : ""
    }${results.balance}`;
}

// Calculate the results once, then pass them to both presentations.
function updateAllocation() {
  const results = calculateShiftResults(assignedCrew);

  renderAllocationGraphic(results);
  renderReadout(results);
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
