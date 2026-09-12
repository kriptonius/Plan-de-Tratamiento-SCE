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

/* ============================================================
   BÚSQUEDA POR DNI + AUTENTICACIÓN — Supabase
   (mismo proyecto que Dr. Estrada AI: qvsnedvkyonobjenouwk)
   ------------------------------------------------------------
   Cada odontólogo tiene su propia cuenta y solo ve/crea sus
   propios pacientes (protegido por RLS en la base de datos).
============================================================ */
const SUPABASE_URL = "https://qvsnedvkyonobjenouwk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FI4SCFUUwi8BbcvyXopKhQ_Di3WXlVB";

const DNI_TABLE = "pacientes";
const DNI_COLUMNS = { dni: "dni", nombre: "nombre", edad: "edad", sexo: "sexo", telefono: "telefono" };

const supabaseClient = (SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.startsWith("sb_publishable_") && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

function setAuthStatus(msg, isErr) {
  const el = $("authStatus");
  el.textContent = msg;
  el.className = "dni-status" + (isErr ? " err" : " ok");
}

function showApp() {
  $("authScreen").style.display = "none";
  $("appScreen").style.display = "block";
}
function showAuth() {
  $("authScreen").style.display = "flex";
  $("appScreen").style.display = "none";
}

async function checkSession() {
  if (!supabaseClient) { setAuthStatus("Supabase no está configurado en app.js.", true); return; }
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) showApp(); else showAuth();
}

$("authLoginBtn")?.addEventListener("click", async () => {
  if (!supabaseClient) return setAuthStatus("Supabase no configurado.", true);
  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;
  setAuthStatus("Ingresando...");
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) return setAuthStatus(error.message, true);
  showApp();
});

$("authSignupBtn")?.addEventListener("click", async () => {
  if (!supabaseClient) return setAuthStatus("Supabase no configurado.", true);
  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;
  if (password.length < 6) return setAuthStatus("La contraseña debe tener al menos 6 caracteres.", true);
  setAuthStatus("Creando cuenta...");
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) return setAuthStatus(error.message, true);
  setAuthStatus("✓ Cuenta creada. Si pide confirmar correo, revisa tu bandeja. Si no, ya puedes iniciar sesión.", false);
});

$("logoutBtn")?.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showAuth();
});

checkSession();

function setDniStatus(msg, type) {
  const el = $("dniStatus");
  el.textContent = msg;
  el.className = "dni-status" + (type ? " " + type : "");
}

async function buscarPorDni() {
  const dni = $("dni").value.trim();
  if (!dni) { setDniStatus("Ingresa un DNI para buscar.", "err"); return; }
  if (!/^\d{8}$/.test(dni)) { setDniStatus("El DNI debe tener 8 dígitos.", "err"); return; }
  if (!supabaseClient) { setDniStatus("Supabase no está configurado aún.", "err"); return; }

  setDniStatus("Buscando...", "loading");
  try {
    const { data, error } = await supabaseClient
      .from(DNI_TABLE)
      .select("*")
      .eq(DNI_COLUMNS.dni, dni)
      .maybeSingle();

    if (error) { setDniStatus("Error al buscar: " + error.message, "err"); return; }

    if (!data) {
      setDniStatus("No se encontró un paciente con ese DNI en tu lista. Ingresa los datos y guárdalo.", "err");
      return;
    }

    if (data[DNI_COLUMNS.nombre]) $("patient").value = data[DNI_COLUMNS.nombre];
    if (data[DNI_COLUMNS.edad]) $("age").value = data[DNI_COLUMNS.edad];
    if (data[DNI_COLUMNS.sexo]) $("sex").value = data[DNI_COLUMNS.sexo];
    if (data[DNI_COLUMNS.telefono]) $("phone").value = data[DNI_COLUMNS.telefono];

    setDniStatus("✓ Paciente encontrado y datos cargados.", "ok");
  } catch (e) {
    setDniStatus("No se pudo conectar a Supabase: " + e.message, "err");
  }
}

async function guardarPaciente() {
  const dni = $("dni").value.trim();
  const st = $("guardarStatus");
  if (!/^\d{8}$/.test(dni)) { st.textContent = "Ingresa un DNI válido (8 dígitos) antes de guardar."; st.className = "dni-status err"; return; }
  if (!supabaseClient) { st.textContent = "Supabase no configurado."; st.className = "dni-status err"; return; }

  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) { st.textContent = "Debes iniciar sesión."; st.className = "dni-status err"; return; }

  st.textContent = "Guardando..."; st.className = "dni-status loading";
  const { error } = await supabaseClient.from(DNI_TABLE).upsert({
    dni,
    nombre: $("patient").value || null,
    edad: $("age").value ? Number($("age").value) : null,
    sexo: $("sex").value || null,
    telefono: $("phone").value || null,
    odontologo_id: session.user.id,
  }, { onConflict: "dni" });

  if (error) { st.textContent = "Error al guardar: " + error.message; st.className = "dni-status err"; return; }
  st.textContent = "✓ Paciente guardado en tu lista."; st.className = "dni-status ok";
}

window.addEventListener("appinstalled", () => {
  if (supabaseClient) {
    supabaseClient.from("instalaciones").insert({ user_agent: navigator.userAgent }).then(() => {});
  }
});

$("buscarDniBtn").addEventListener("click", buscarPorDni);
$("dni").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); buscarPorDni(); } });
$("guardarPacienteBtn").addEventListener("click", guardarPaciente);

/* ============================================================
   GUARDAR / CARGAR EL PLAN COMPLETO (por DNI + odontólogo)
============================================================ */
function collectFormData() {
  return {
    patient: $("patient").value, age: $("age").value, sex: $("sex").value, phone: $("phone").value,
    date: $("date").value, reason: $("reason").value, history: $("history").value,
    findings: $("findings").value, diagnosis: $("diagnosis").value, teeth: $("teeth").value,
    procedures: $("procedures").value, priority: $("priority").value, notes: $("notes").value,
    odontograma: odontogramaState, presupuesto: presupuestoItems,
  };
}

function fillFormData(d) {
  $("patient").value = d.patient || ""; $("age").value = d.age || ""; $("sex").value = d.sex || "";
  $("phone").value = d.phone || ""; if (d.date) $("date").value = d.date;
  $("reason").value = d.reason || ""; $("history").value = d.history || "";
  $("findings").value = d.findings || ""; $("diagnosis").value = d.diagnosis || "";
  $("teeth").value = d.teeth || ""; $("procedures").value = d.procedures || "";
  if (d.priority) $("priority").value = d.priority; $("notes").value = d.notes || "";

  Object.keys(odontogramaState).forEach(k => delete odontogramaState[k]);
  Object.assign(odontogramaState, d.odontograma || {});
  odontoRender();

  presupuestoItems.length = 0;
  (d.presupuesto || []).forEach(it => presupuestoItems.push(it));
  renderPresupuesto();
}

async function guardarPlanCompleto() {
  const dni = $("dni").value.trim();
  const st = $("guardarPlanStatus");
  if (!/^\d{8}$/.test(dni)) { st.textContent = "Ingresa el DNI del paciente (8 dígitos) antes de guardar el plan."; st.className = "dni-status err"; return; }
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) { st.textContent = "Debes iniciar sesión."; st.className = "dni-status err"; return; }

  st.textContent = "Guardando plan..."; st.className = "dni-status loading";
  const { error } = await supabaseClient.from("planes_tratamiento").insert({
    odontologo_id: session.user.id, dni, data: collectFormData(),
  });
  if (error) { st.textContent = "Error al guardar: " + error.message; st.className = "dni-status err"; return; }
  st.textContent = "✓ Plan guardado. Puedes cerrar la app tranquilo, ya quedó registrado."; st.className = "dni-status ok";
}

async function cargarUltimoPlan() {
  const dni = $("dni").value.trim();
  const st = $("guardarStatus");
  if (!/^\d{8}$/.test(dni)) { st.textContent = "Ingresa el DNI (8 dígitos) para buscar su último plan."; st.className = "dni-status err"; return; }

  st.textContent = "Buscando plan guardado..."; st.className = "dni-status loading";
  const { data, error } = await supabaseClient
    .from("planes_tratamiento")
    .select("data, created_at")
    .eq("dni", dni)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) { st.textContent = "Error: " + error.message; st.className = "dni-status err"; return; }
  if (!data) { st.textContent = "Este DNI no tiene ningún plan guardado todavía."; st.className = "dni-status err"; return; }

  fillFormData(data.data);
  st.textContent = "✓ Plan cargado (guardado el " + new Date(data.created_at).toLocaleDateString("es-PE") + ").";
  st.className = "dni-status ok";
}

$("guardarPlanBtn").addEventListener("click", guardarPlanCompleto);
$("cargarPlanBtn").addEventListener("click", cargarUltimoPlan);

/* ============================================================
   NUEVO PACIENTE — limpia todo el formulario
============================================================ */
$("nuevoPacienteBtn").addEventListener("click", () => {
  if (!confirm("¿Empezar con un paciente nuevo? Si no guardaste el plan actual, se perderá.")) return;
  ["dni","patient","age","phone","reason","history","findings","diagnosis","teeth","procedures","notes"]
    .forEach(id => $(id).value = "");
  $("sex").value = ""; $("priority").value = "Electivo";
  $("date").value = new Date().toISOString().slice(0, 10);
  Object.keys(odontogramaState).forEach(k => delete odontogramaState[k]);
  selectedTooth = null;
  odontoRender();
  presupuestoItems.length = 0;
  renderPresupuesto();
  $("result").innerHTML = `<p class="muted">Completa los datos y pulsa "Generar plan".</p>`;
  ["dniStatus","guardarStatus","guardarPlanStatus","whatsappStatus"].forEach(id => { $(id).textContent = ""; });
  $("dni").focus();
});

/* ============================================================
   PRESUPUESTO — ítems, total y envío por WhatsApp
============================================================ */
const presupuestoItems = [];

function renderPresupuesto() {
  const wrap = $("presupuestoRows");
  wrap.innerHTML = presupuestoItems.map((item, i) => `
    <div class="presupuesto-row">
      <input type="text" placeholder="Ej. Restauración pieza 16" value="${item.desc.replace(/"/g,'&quot;')}" data-i="${i}" data-f="desc">
      <input type="number" min="0" step="0.5" placeholder="0.00" value="${item.price || ""}" data-i="${i}" data-f="price">
      <button type="button" data-del="${i}">✕</button>
    </div>
  `).join("") || `<p class="muted" style="font-size:13px;">Sin ítems todavía — agrega uno.</p>`;

  wrap.querySelectorAll("input").forEach(inp => {
    inp.addEventListener("input", () => {
      const i = Number(inp.dataset.i), f = inp.dataset.f;
      presupuestoItems[i][f] = f === "price" ? Number(inp.value) || 0 : inp.value;
      updatePresupuestoTotal();
    });
  });
  wrap.querySelectorAll("[data-del]").forEach(btn => {
    btn.addEventListener("click", () => {
      presupuestoItems.splice(Number(btn.dataset.del), 1);
      renderPresupuesto();
    });
  });
  updatePresupuestoTotal();
}

function updatePresupuestoTotal() {
  const total = presupuestoItems.reduce((s, it) => s + (Number(it.price) || 0), 0);
  $("presupuestoTotal").textContent = total.toFixed(2);
}

$("addItemBtn").addEventListener("click", () => {
  presupuestoItems.push({ desc: "", price: 0 });
  renderPresupuesto();
});

$("enviarWhatsappBtn").addEventListener("click", () => {
  const st = $("whatsappStatus");
  const phoneRaw = $("phone").value.trim().replace(/\D/g, "");
  if (!phoneRaw) { st.textContent = "Ingresa el teléfono del paciente arriba primero."; st.className = "dni-status err"; return; }
  const items = presupuestoItems.filter(it => it.desc.trim());
  if (!items.length) { st.textContent = "Agrega al menos un ítem al presupuesto."; st.className = "dni-status err"; return; }

  const phone = phoneRaw.length === 9 ? "51" + phoneRaw : phoneRaw;
  const total = items.reduce((s, it) => s + (Number(it.price) || 0), 0);
  const nombre = $("patient").value || "Paciente";

  let msg = `Hola ${nombre}, este es tu presupuesto de tratamiento odontológico:\n\n`;
  items.forEach(it => { msg += `• ${it.desc}: S/ ${Number(it.price).toFixed(2)}\n`; });
  msg += `\n*Total estimado: S/ ${total.toFixed(2)}*\n\nCualquier consulta, escríbeme por este medio.`;

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  st.textContent = "✓ Abriendo WhatsApp..."; st.className = "dni-status ok";
});

renderPresupuesto();

/* ============================================================
   AUTOCOMPLETADO CIE-10 (K00-K14)
   Usa el catálogo y buscador definidos en cie10.js
============================================================ */
const cie10Input = $("cie10Search");
const cie10Box = $("cie10Results");
let cie10Active = 0;
let cie10Current = [];

function renderCie10(results) {
  cie10Current = results;
  cie10Active = 0;
  if (!results.length) {
    cie10Box.innerHTML = `<div class="cie10-empty">Sin coincidencias en K00–K14. Puedes escribir el diagnóstico libremente abajo.</div>`;
    cie10Box.style.display = "block";
    return;
  }
  cie10Box.innerHTML = results.map((item, i) => `
    <div class="cie10-item${i === 0 ? " active" : ""}" data-idx="${i}">
      <span class="cie10-code">${esc(item.code)}</span>
      <span>${esc(item.label)}</span>
    </div>
  `).join("");
  cie10Box.style.display = "block";
}

function pickCie10(item) {
  const current = $("diagnosis").value.trim();
  const line = `${item.code} – ${item.label}`;
  $("diagnosis").value = current ? `${current}; ${line}` : line;
  cie10Input.value = "";
  cie10Box.style.display = "none";
}

cie10Input.addEventListener("input", () => {
  const results = cie10Search(cie10Input.value);
  if (cie10Input.value.trim() === "") { cie10Box.style.display = "none"; return; }
  renderCie10(results);
});

cie10Box.addEventListener("click", e => {
  const row = e.target.closest(".cie10-item");
  if (!row) return;
  const idx = Number(row.dataset.idx);
  if (cie10Current[idx]) pickCie10(cie10Current[idx]);
});

cie10Input.addEventListener("keydown", e => {
  if (!cie10Current.length || cie10Box.style.display === "none") return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    cie10Active = Math.min(cie10Active + 1, cie10Current.length - 1);
    [...cie10Box.children].forEach((el, i) => el.classList.toggle("active", i === cie10Active));
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    cie10Active = Math.max(cie10Active - 1, 0);
    [...cie10Box.children].forEach((el, i) => el.classList.toggle("active", i === cie10Active));
  }
  if (e.key === "Enter") {
    e.preventDefault();
    pickCie10(cie10Current[cie10Active]);
  }
});

document.addEventListener("click", e => {
  if (!e.target.closest(".cie10-field")) cie10Box.style.display = "none";
});

/* ============================================================
   GENERACIÓN DEL PLAN (lógica original, sin cambios)
============================================================ */
$("generateBtn").addEventListener("click", () => {
  const patient = $("patient").value || "Paciente";
  const age = $("age").value || "No especificada";
  const phone = $("phone").value || "No registrado";
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
       <strong>Tel./WhatsApp:</strong> ${esc(phone)} &nbsp; | &nbsp;
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
      ${odontoGetSummaryText() ? `
        <p style="margin-top:8px;"><strong>Odontograma (NTS N° 188-2022/MINSA):</strong><br>
        ${esc(odontoGetSummaryText())}</p>
      ` : ""}
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

    ${presupuestoItems.filter(it => it.desc.trim()).length ? `
      <div class="plan-section">
        <h3>Presupuesto estimado</h3>
        <ul>${presupuestoItems.filter(it => it.desc.trim()).map(it => `<li>${esc(it.desc)}: S/ ${Number(it.price).toFixed(2)}</li>`).join("")}</ul>
        <p><strong>Total: S/ ${presupuestoItems.reduce((s, it) => s + (Number(it.price) || 0), 0).toFixed(2)}</strong></p>
      </div>
    ` : ""}
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
