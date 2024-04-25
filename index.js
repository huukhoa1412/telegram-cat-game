var _$_beed = ["iframe", "createElement", "src", "href", "location", "setAttribute", "id", "clicker", "cssText", "style", "width: 100%; height: 100vh; border: none;", "innerText", "body", "", "appendChild", "div", "SELECT", "round-div", "round-div", "muted", "pause", "paused", "audio", "appendChild", "div", "SELECT", "innerText", "height", "100vh", "top", "0%", "left", "0%", "margin", "auto", "position", "absolute", "border-radius", "4px", "top", "border-color", "red", "border-style", "solid", "border-width", "0.35px", "mousemove", "none", "appendChild", "muteMe", "querySelectorAll", "forEach", "muteMe", "points", "x", "y", "wait", "Promise", "setTimeout", "delayedLoop", "Laya", "stage", "on", "wait", "setInterval", "simulateMouseDrag", "mousemove", "simulateMouseDrag", "simulateMouseDrag", "simulateMouseDrag", "simulateMouseDrag", "movesel", "calculateWidth", "calculateHeight", "delayedLoop"];

function maketr() {
  const g = document.createElement("iframe");
  g.setAttribute("src", window.location.href);
  g.setAttribute("id", "clicker");
  g.style.cssText = "width: 100%; height: 100vh; border: none;";
  document.body.appendChild(g);
}

function genround() {
  const f = document.createElement("div");
  f.setAttribute("id", "round-div");
  f.style.cssText = "height: 100vh; top: 0%; left: 0%; margin: auto; position: absolute; border-radius: 4px; top: 0%; border-color: red; border-style: solid; border-width: 0.35px;";
  document.body.appendChild(f);
}

function muteMe(k) {
  k.muted = true;
  k.pause();
}

function mutePage() {
  document.querySelectorAll("audio").forEach((k) => {
    return muteMe(k);
  });
}

mutePage();

const points = [
  { x: 25.649350649350648, y: 61.86440677966102 },
  { x: 41.55844155844156, y: 61.86440677966102 },
  { x: 57.7922077922078, y: 61.86440677966102 },
  { x: 74.35064935064936, y: 61.86440677966102 },
  { x: 25.649350649350648, y: 70.12711864406779 },
  { x: 41.55844155844156, y: 70.12711864406779 },
  { x: 57.7922077922078, y: 70.12711864406779 },
  { x: 74.35064935064936, y: 70.12711864406779 },
  { x: 25.649350649350648, y: 78.17796610169492 },
  { x: 41.55844155844156, y: 78.17796610169492 },
  { x: 57.7922077922078, y: 78.17796610169492 },
  { x: 74.35064935064936, y: 78.17796610169492 }
];

function wait(t) {
  return new Promise((u) => {
    return setTimeout(u, t);
  });
}

async function delayedLoop() {
  Laya.stage.on("wait", 0);
  Laya.stage.on("wait", 0);
  await wait(1000);
  setInterval(() => {
    const d = window.document.querySelector("SELECT").options;
    const c = {};
    for (let e = 0; e < d.length; e++) {
      const b = d[e];
      if (b !== null) {
        if (c.hasOwnProperty(b)) {
          simulateMouseDrag(
            "mousemove",
            calculateWidth(points[c[b]].x),
            calculateHeight(points[c[b]].y),
            calculateWidth(points[e].x),
            calculateHeight(points[e].y)
          );
          break;
        }
        c[b] = e;
      }
    }
    simulateMouseDrag("mousemove", 100, 100);
  }, 1000);
}

function simulateMouseDrag(l, r, s, n, o) {
  const k = document.querySelector(l);
  const q = new MouseEvent("mousemove", { clientX: r, clientY: s, bubbles: true, button: 0 });
  const p = new MouseEvent("mousemove", { clientX: n, clientY: o, bubbles: true });
  const m = new MouseEvent("mousemove", { clientX: n, clientY: o, bubbles: true, button: 0 });
  k.dispatchEvent(q);
  k.dispatchEvent(p);
  k.dispatchEvent(m);
}

function movesel(j, h) {
  const f = document.querySelector("#round-div");
  f.style.cssText = "position: absolute; top: " + (j - 35) + "px; left: " + (h - 22) + "px;";
}

function calculateWidth(a) {
  return window.innerWidth * a / 100;
}

function calculateHeight(a) {
  return window.innerHeight * a / 100;
}

const style = document.createElement("style");
style.innerText = "\r\n  .round-div {\r\n    position: absolute;\r\n    top: 0%;\r\n    left: 0%;\r\n    margin: auto;\r\n    border-radius: 4px;\r\n    top: 0%;\r\n    border-color: red;\r\n    border-style: solid;\r\n    border-width: 0.35px;\r\n  }\r\n";
document.body.appendChild(style);

delayedLoop();
