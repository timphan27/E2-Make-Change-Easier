export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;

const capacity = 10;
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

// store the shared shield values in one typed snapshot.
type ShieldSnapshot = {
  currentCharge: number;
  capacity: number;
  missingCharge: number;
};

//create specificed object of type ShieldSnapshot to return current values of shield
function getShieldSnapshot(): ShieldSnapshot {
  return {
    currentCharge: count,
    capacity: capacity,
    missingCharge: capacity - count,
  };
}

function drawMeter(snapshot: ShieldSnapshot) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < snapshot.capacity; i++) {
    ctx.fillStyle = i < snapshot.currentCharge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(
    `${snapshot.currentCharge} / ${snapshot.capacity} shield`,
    12,
    100,
  );
  readout.textContent =
    `Shield charge: ${snapshot.currentCharge} / ${snapshot.capacity}`;
}

function updateStats(snapshot: ShieldSnapshot) {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(snapshot);
}

function renderStats(snapshot: ShieldSnapshot) {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${snapshot.currentCharge} · Missing charge: ${snapshot.missingCharge}`;
}

function refreshViews() {
  const snapshot = getShieldSnapshot();
  drawMeter(snapshot);
  if (panel) updateStats(snapshot);
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(capacity, next));
  if (bounded === count) return;
  count = bounded;
  refreshViews();
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(getShieldSnapshot());
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
};

refreshViews();
