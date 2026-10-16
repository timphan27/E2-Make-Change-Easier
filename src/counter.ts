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
let inspectorListener: (() => void) | null = null;

// Store the shared shield values in one typed snapshot.
type ShieldSnapshot = {
  currentCharge: number;
  capacity: number;
  missingCharge: number;
};

// Create and return an object of type ShieldSnapshot with the current shield values.
function getShieldSnapshot(): ShieldSnapshot {
  return {
    currentCharge: count,
    capacity: capacity,
    missingCharge: capacity - count,
  };
}

// Announce completed shield changes.
const shieldEvents = new EventTarget();

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

function renderStats(
  targetPanel: HTMLParagraphElement,
  snapshot: ShieldSnapshot,
) {
  targetPanel.textContent =
    `Shield charge: ${snapshot.currentCharge} · Missing charge: ${snapshot.missingCharge}`;
}

// Listen for completed changes and update the permanent HUD display.
shieldEvents.addEventListener("shieldchange", () => {
  drawMeter(getShieldSnapshot());
});

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(capacity, next));
  if (bounded === count) return;
  count = bounded;

  // Announce the change so subscribed views can update.
  shieldEvents.dispatchEvent(new Event("shieldchange"));
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

  // Show the current snapshot without counting it as a delivery.
  renderStats(panel, getShieldSnapshot());

  // Subscribe the inspector to future shield changes.
  const currentPanel = panel;
  inspectorListener = () => {
    panelUpdates++;
    diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
    renderStats(currentPanel, getShieldSnapshot());
  };

  shieldEvents.addEventListener("shieldchange", inspectorListener);
};

document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;

  // Stop receiving events before removing the inspector.
  if (inspectorListener) {
    shieldEvents.removeEventListener("shieldchange", inspectorListener);
    inspectorListener = null;
  }

  panel.remove();
  panel = null;
};

// Draw the initial permanent display.
drawMeter(getShieldSnapshot());
