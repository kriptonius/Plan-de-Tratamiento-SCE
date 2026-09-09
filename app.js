const $ = id => document.getElementById(id);

$("date").value = new Date().toISOString().slice(0, 10);

function esc(text) {
  return String(text || "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

function bullets(text) {
  return String(text || "")
    .split(/[;\n]+/)
    .map(x => x.trim())
    .filter(Boolean)
    .map(x => `<li>${esc(x)}</li>`)
    .join("");
}

$("generateBtn").addEventListener("click", () => {
  const patient = $("patient").value || "Paciente";
  const age = $("age").value || "No especificada";
  const sex = $("sex").value || "No especificado";
  const date = $("date").value || new Date().toLocaleDateString("es-PE");
  const reason = $("reason").value || "No registrado";
  const history = $("history").value || "No registrado";
  const findings = $("findings").value || "No registrados";
  const diagnosis = $("diagnosis").value || "Pendiente de validación";
  const teeth = $("teeth").value || "No especificadas";
  const procedures = $("procedures").value || "Pendientes de definir";
  const priority = $("priority").value;
  const notes = $("notes").value || "Sin observaciones";

  $("result").innerHTML = `
    <div class="plan-title">PLAN DE TRATAMIENTO ODONTOLÓGICO</div>
    <p><strong>Paciente:</strong> ${esc(patient)} &nbsp; | &nbsp;
       <strong>Edad:</strong> ${esc(age)} &nbsp; | &nbsp;
       <strong>Sexo:</strong> ${esc(sex)} &nbsp; | &nbsp;
       <strong>Fecha:</strong> ${esc(date)}</p>

    <div class="plan-section">
      <h3>1. Motivo de consulta</h3>
      <p>${esc(reason)}</p>
    </div>

    <div class="plan-section">
      <h3>2. Antecedentes / consideraciones</h3>
      <p>${esc(history)}</p>
    </div>

    <div class="plan-section">
      <h3>3. Hallazgos clínicos</h3>
      <p>${esc(findings)}</p>
    </div>

    <div class="plan-section">
      <h3>4. Diagnóstico</h3>
      <p>${esc(diagnosis)}</p>
    </div>

    <div class="plan-section">
      <h3>5. Piezas involucradas</h3>
      <p>${esc(teeth)}</p>
    </div>

    <div class="plan-section">
      <h3>6. Objetivos del tratamiento</h3>
      <ul>
        <li>Controlar los problemas odontológicos identificados.</li>
        <li>Restablecer salud, función y/o estética según corresponda.</li>
        <li>Prevenir progresión de enfermedad y establecer mantenimiento.</li>
      </ul>
    </div>

    <div class="plan-section">
      <h3>7. Plan por fases</h3>
      <ol>
        <li><strong>Fase inicial:</strong> atención de urgencias y control de factores de riesgo, según indicación clínica.</li>
        <li><strong>Fase terapéutica:</strong> ejecutar los procedimientos validados por el odontólogo.</li>
        <li><strong>Fase de mantenimiento:</strong> controles y prevención individualizada.</li>
      </ol>
    </div>

    <div class="plan-section">
      <h3>8. Procedimientos propuestos</h3>
      <ul>${bullets(procedures)}</ul>
    </div>

    <div class="plan-section">
      <h3>9. Prioridad</h3>
      <p><strong>${esc(priority)}</strong></p>
    </div>

    <div class="plan-section">
      <h3>10. Observaciones</h3>
      <p>${esc(notes)}</p>
    </div>

    <hr>
    <p><strong>Nota:</strong> El presente documento es un apoyo de organización y redacción.
    El diagnóstico definitivo, pronóstico, indicaciones, secuencia y ejecución del tratamiento
    corresponden al profesional odontólogo responsable.</p>
  `;
});

$("printBtn").addEventListener("click", () => window.print());

$("copyBtn").addEventListener("click", async () => {
  const text = $("result").innerText;
  try {
    await navigator.clipboard.writeText(text);
    $("copyBtn").textContent = "✓ Copiado";
    setTimeout(() => $("copyBtn").textContent = "Copiar texto", 1500);
  } catch {
    alert("No se pudo copiar automáticamente. Selecciona y copia el texto.");
  }
});
