/* ---------------------------------------------------------
   Catálogo CIE-10 (OMS) — Capítulo XI, rango K00-K14
   Enfermedades de la cavidad bucal, glándulas salivales y maxilares
--------------------------------------------------------- */
const CIE10 = [
  { code: "K00.0", label: "Anodoncia", tags: "ausencia congenita dientes hipodoncia oligodoncia" },
  { code: "K00.1", label: "Dientes supernumerarios", tags: "diente extra mesiodens" },
  { code: "K00.2", label: "Anomalías del tamaño y forma de los dientes", tags: "macrodoncia microdoncia fusion geminacion" },
  { code: "K00.3", label: "Dientes moteados", tags: "fluorosis manchas esmalte" },
  { code: "K00.4", label: "Alteraciones de la formación dentaria", tags: "hipoplasia esmalte" },
  { code: "K00.6", label: "Alteraciones de la erupción dentaria", tags: "retraso erupcion" },
  { code: "K00.7", label: "Síndrome de la erupción dentaria", tags: "molestias erupcion bebe" },
  { code: "K00.9", label: "Trastorno del desarrollo dentario, no especificado", tags: "" },

  { code: "K01.0", label: "Dientes incluidos", tags: "diente no erupcionado" },
  { code: "K01.1", label: "Dientes impactados", tags: "muela del juicio cordal retenida tercer molar impactado" },

  { code: "K02.0", label: "Caries limitada al esmalte", tags: "caries incipiente mancha blanca" },
  { code: "K02.1", label: "Caries de la dentina", tags: "caries profunda" },
  { code: "K02.2", label: "Caries del cemento", tags: "caries radicular cuello" },
  { code: "K02.3", label: "Caries dental detenida", tags: "caries inactiva paralizada" },
  { code: "K02.4", label: "Odontoclasia", tags: "caries infantil severa" },
  { code: "K02.8", label: "Otras caries dentales", tags: "" },
  { code: "K02.9", label: "Caries dental, no especificada", tags: "caries" },

  { code: "K03.0", label: "Atrición excesiva", tags: "desgaste dental bruxismo" },
  { code: "K03.1", label: "Abrasión dentaria", tags: "desgaste cepillado" },
  { code: "K03.2", label: "Erosión dentaria", tags: "desgaste acido" },
  { code: "K03.3", label: "Reabsorción patológica de dientes", tags: "" },
  { code: "K03.4", label: "Hipercementosis", tags: "" },
  { code: "K03.5", label: "Anquilosis dentaria", tags: "diente anquilosado sumergido" },
  { code: "K03.6", label: "Depósitos [acreciones] sobre los dientes", tags: "sarro calculo placa tartaro" },
  { code: "K03.7", label: "Cambios de color post-eruptivos de tejidos duros", tags: "manchas dientes pigmentacion" },
  { code: "K03.9", label: "Enfermedad de tejidos duros de dientes, no especificada", tags: "" },

  { code: "K04.0", label: "Pulpitis", tags: "dolor pulpar nervio inflamado" },
  { code: "K04.1", label: "Necrosis de la pulpa", tags: "diente muerto necrosis pulpar" },
  { code: "K04.2", label: "Degeneración de la pulpa", tags: "calcificacion pulpar" },
  { code: "K04.3", label: "Formación anormal de tejido duro en la pulpa", tags: "" },
  { code: "K04.4", label: "Periodontitis apical aguda de origen pulpar", tags: "dolor al morder infeccion apical aguda" },
  { code: "K04.5", label: "Periodontitis apical crónica", tags: "granuloma periapical" },
  { code: "K04.6", label: "Absceso periapical con fístula", tags: "absceso paperita fogata" },
  { code: "K04.7", label: "Absceso periapical sin fístula", tags: "absceso dental inflamacion" },
  { code: "K04.8", label: "Quiste radicular", tags: "quiste periapical" },
  { code: "K04.9", label: "Otras enfermedades de la pulpa y tejidos periapicales", tags: "" },

  { code: "K05.0", label: "Gingivitis aguda", tags: "encias sangrantes inflamadas" },
  { code: "K05.1", label: "Gingivitis crónica", tags: "encias inflamadas cronica" },
  { code: "K05.2", label: "Periodontitis aguda", tags: "enfermedad periodontal aguda" },
  { code: "K05.3", label: "Periodontitis crónica", tags: "piorrea perdida de hueso encias" },
  { code: "K05.4", label: "Periodontosis", tags: "" },
  { code: "K05.5", label: "Otras enfermedades periodontales", tags: "" },
  { code: "K05.6", label: "Enfermedad periodontal, no especificada", tags: "" },

  { code: "K06.0", label: "Retracción gingival", tags: "recesion encia diente largo" },
  { code: "K06.1", label: "Hiperplasia gingival", tags: "crecimiento encia agrandamiento" },
  { code: "K06.2", label: "Lesiones de la encía asociadas con traumatismo", tags: "trauma encia" },
  { code: "K06.9", label: "Trastorno de la encía, no especificado", tags: "" },

  { code: "K07.0", label: "Anomalías importantes del tamaño de los maxilares", tags: "prognatismo retrognatismo" },
  { code: "K07.1", label: "Anomalías de la relación maxilobasilar", tags: "" },
  { code: "K07.2", label: "Anomalías de la relación entre arcadas dentarias", tags: "mordida cruzada abierta" },
  { code: "K07.3", label: "Anomalías de la posición del diente", tags: "apiñamiento diastema diente girado" },
  { code: "K07.4", label: "Maloclusión, no especificada", tags: "mala mordida" },
  { code: "K07.6", label: "Trastornos de la articulación temporomandibular", tags: "atm dolor mandibula chasquido" },
  { code: "K07.9", label: "Anomalía dentofacial, no especificada", tags: "" },

  { code: "K08.1", label: "Pérdida de dientes por accidente, extracción o enf. periodontal", tags: "diente perdido edentulo" },
  { code: "K08.2", label: "Atrofia del reborde alveolar edéntulo", tags: "reabsorcion hueso" },
  { code: "K08.3", label: "Raíz dentaria retenida", tags: "resto radicular" },
  { code: "K08.8", label: "Otros trastornos de dientes y estructuras de sostén", tags: "diente flojo movilidad dental" },
  { code: "K08.9", label: "Trastorno de dientes y estructuras de sostén, no especificado", tags: "" },

  { code: "K09.0", label: "Quistes odontogénicos del desarrollo", tags: "quiste dentigero" },
  { code: "K09.1", label: "Quistes de fisura del desarrollo (no odontogénico)", tags: "" },
  { code: "K09.9", label: "Quiste de la región bucal, no especificado", tags: "" },

  { code: "K10.2", label: "Enfermedades inflamatorias de los maxilares", tags: "osteomielitis maxilar" },
  { code: "K10.3", label: "Alveolitis de los maxilares", tags: "alveolitis seca postextraccion" },
  { code: "K10.9", label: "Enfermedad de los maxilares, no especificada", tags: "" },

  { code: "K11.2", label: "Sialoadenitis", tags: "inflamacion glandula salival" },
  { code: "K11.5", label: "Sialolitiasis", tags: "calculo salival piedra" },
  { code: "K11.6", label: "Mucocele de la glándula salival", tags: "mucocele ranula" },
  { code: "K11.7", label: "Trastornos de la secreción salival", tags: "boca seca xerostomia sialorrea" },

  { code: "K12.0", label: "Aftas bucales recurrentes", tags: "afta llaga boca ulcera" },
  { code: "K12.1", label: "Otras formas de estomatitis", tags: "estomatitis inflamacion boca" },
  { code: "K12.2", label: "Celulitis y absceso de la boca", tags: "" },

  { code: "K13.0", label: "Enfermedades de los labios", tags: "queilitis labios" },
  { code: "K13.1", label: "Mordedura del carrillo y del labio", tags: "" },
  { code: "K13.2", label: "Leucoplasia y otras alteraciones del epitelio bucal", tags: "mancha blanca mucosa" },
  { code: "K13.7", label: "Otras lesiones de la mucosa bucal, no especificadas", tags: "lesion mucosa" },

  { code: "K14.0", label: "Glositis", tags: "lengua inflamada" },
  { code: "K14.1", label: "Lengua geográfica", tags: "" },
  { code: "K14.3", label: "Hipertrofia de las papilas linguales", tags: "" },
  { code: "K14.5", label: "Lengua fisurada", tags: "lengua con grietas" },
  { code: "K14.6", label: "Glosodinia", tags: "dolor de lengua ardor" },
  { code: "K14.9", label: "Enfermedad de la lengua, no especificada", tags: "" },
];

function cie10Normalize(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function cie10Search(query) {
  const q = cie10Normalize(query).trim();
  if (!q) return [];
  return CIE10
    .map(item => {
      const haystack = cie10Normalize(`${item.code} ${item.label} ${item.tags}`);
      const idx = haystack.indexOf(q);
      if (idx === -1) return null;
      const score = idx === 0 ? 0 : (haystack[idx - 1] === " " ? 1 : 2);
      return { item, score };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score)
    .slice(0, 8)
    .map(r => r.item);
}
