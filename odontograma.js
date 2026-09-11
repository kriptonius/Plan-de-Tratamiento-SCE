/* ============================================================
   ODONTOGRAMA — Norma Técnica N° 188-2022/MINSA
   Simbología: rojo = patología/indicado, azul = buen estado,
   verde = diente en erupción.
============================================================ */

const TEETH_UPPER = [18,17,16,15,14,13,12,11, 21,22,23,24,25,26,27,28];
const TEETH_LOWER = [48,47,46,45,44,43,42,41, 31,32,33,34,35,36,37,38];

const CONDITIONS = {
  caries:            { label: "Caries",                                  color: "#E5484D", symbol: "●" },
  obturado_bien:     { label: "Obturación — buen estado",                 color: "#3B82F6", symbol: "■" },
  obturado_mal:      { label: "Obturación — indicada / mal estado",       color: "#E5484D", symbol: "■" },
  corona_bien:       { label: "Corona / tramo fijo — buen estado",        color: "#3B82F6", symbol: "▲" },
  corona_mal:        { label: "Corona — indicada / mal estado",           color: "#E5484D", symbol: "▲" },
  protesis_bien:     { label: "Prótesis removible — buen estado",         color: "#3B82F6", symbol: "=" },
  protesis_mal:      { label: "Prótesis removible — indicada / mal estado", color: "#E5484D", symbol: "=" },
  ext_indicada:      { label: "Extracción indicada",                      color: "#E5484D", symbol: "X" },
  extraido:          { label: "Diente extraído",                          color: "#3B82F6", symbol: "X" },
  sin_erupcionar:    { label: "Sin erupcionar",                           color: "#3B82F6", symbol: "○" },
  en_erupcion:       { label: "Diente en erupción",                       color: "#22C55E", symbol: "○" },
  endodoncia_bien:   { label: "Endodoncia — tratamiento en buen estado",  color: "#3B82F6", symbol: "N" },
  endodoncia_mal:    { label: "Endodoncia indicada / retratamiento",      color: "#E5484D", symbol: "N" },
  perno_bien:        { label: "Perno — buen estado",                     color: "#3B82F6", symbol: "❘" },
  perno_mal:         { label: "Perno — indicado / mal estado",           color: "#E5484D", symbol: "❘" },
  sellante_bien:     { label: "Sellante — buen estado",                  color: "#3B82F6", symbol: "S" },
  sellante_mal:      { label: "Sellante — indicado / mal estado",        color: "#E5484D", symbol: "S" },
  provisional:       { label: "Provisional",                             color: "#3B82F6", symbol: "P" },
};

const odontogramaState = {}; // { "16": "caries", "26": "obturado_bien", ... }
let selectedTooth = null;

function odontoBuildChart() {
  const upperEl = document.getElementById("odontoUpper");
  const lowerEl = document.getElementById("odontoLower");
  upperEl.innerHTML = TEETH_UPPER.map(odontoToothBtn).join("");
  lowerEl.innerHTML = TEETH_LOWER.map(odontoToothBtn).join("");

  const paletteEl = document.getElementById("odontoPalette");
  paletteEl.innerHTML = Object.entries(CONDITIONS).map(([key, c]) => `
    <button type="button" class="odonto-chip" data-cond="${key}" style="--c:${c.color}">
      <span class="odonto-chip-symbol">${c.symbol}</span> ${c.label}
    </button>
  `).join("") + `<button type="button" class="odonto-chip odonto-chip-clear" data-cond="__clear">Quitar marca</button>`;

  document.querySelectorAll(".odonto-tooth").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedTooth = btn.dataset.tooth;
      odontoRender();
    });
  });
  paletteEl.querySelectorAll(".odonto-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      if (!selectedTooth) {
        document.getElementById("odontoHint").textContent = "Primero toca una pieza dentaria arriba.";
        return;
      }
      const cond = chip.dataset.cond;
      if (cond === "__clear") delete odontogramaState[selectedTooth];
      else odontogramaState[selectedTooth] = cond;
      odontoRender();
    });
  });

  odontoRender();
}

function odontoToothBtn(n) {
  return `<button type="button" class="odonto-tooth" data-tooth="${n}">
            <span class="odonto-num">${n}</span>
            <span class="odonto-mark"></span>
          </button>`;
}

function odontoRender() {
  document.querySelectorAll(".odonto-tooth").forEach(btn => {
    const n = btn.dataset.tooth;
    const cond = odontogramaState[n];
    const mark = btn.querySelector(".odonto-mark");
    btn.classList.toggle("selected", n === selectedTooth);
    if (cond) {
      const c = CONDITIONS[cond];
      mark.textContent = c.symbol;
      mark.style.color = c.color;
      btn.style.borderColor = c.color;
    } else {
      mark.textContent = "";
      btn.style.borderColor = "";
    }
  });

  const hint = document.getElementById("odontoHint");
  hint.textContent = selectedTooth
    ? `Pieza ${selectedTooth} seleccionada — toca una condición abajo.`
    : "Toca una pieza dentaria para marcar su condición.";

  const summaryEl = document.getElementById("odontoSummary");
  const entries = Object.entries(odontogramaState);
  if (!entries.length) {
    summaryEl.innerHTML = `<span class="muted">Sin piezas marcadas todavía.</span>`;
  } else {
    summaryEl.innerHTML = entries
      .sort((a, b) => a[0] - b[0])
      .map(([n, cond]) => `<span class="odonto-tag" style="--c:${CONDITIONS[cond].color}">${n}: ${CONDITIONS[cond].label}</span>`)
      .join(" ");
  }
}

function odontoGetSummaryText() {
  const entries = Object.entries(odontogramaState).sort((a, b) => a[0] - b[0]);
  if (!entries.length) return "";
  return entries.map(([n, cond]) => `${n}: ${CONDITIONS[cond].label}`).join("; ");
}

document.addEventListener("DOMContentLoaded", odontoBuildChart);
