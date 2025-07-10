async function generarContenido() {
  const tema = document.getElementById("tema").value.trim();
  const nivel = document.getElementById("nivel").value;
  const tipo = document.getElementById("tipo").value;

  if (!tema) {
    document.getElementById("resultado").innerText = "Por favor, escribe un tema.";
    return;
  }

  
  let prompt = "";
if (tipo === "explicacion") {
  prompt = `Explica el tema "${tema}" de forma interactiva para estudiantes de ${nivel}, todo en español.`;
} else if (tipo === "preguntas") {
  prompt = `Genera 5 preguntas de opción múltiple sobre "${tema}" para estudiantes de ${nivel}, con sus respuestas explicadas, todo en español.`;
} else if (tipo === "actividad") {
  prompt = `Diseña una actividad educativa sobre "${tema}" para estudiantes de ${nivel}. Incluye objetivo, materiales e instrucciones, todo en español.`;
}



  // Mostrar mensaje mientras se espera respuesta
  const resultado = document.getElementById("resultado");
  resultado.innerText = "⏳ Generando contenido...";

  // Usamos FormData para enviar el prompt al PHP
  const formData = new FormData();
  formData.append("prompt", prompt);

  try {
    const response = await fetch("api_LmStudioLocal.php", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.error) {
      resultado.innerText = ` Error: ${result.message || "No se pudo generar contenido."}`;
    } else {
      resultado.innerText = result.message;
    }
  } catch (error) {
    console.error("Error:", error);
    resultado.innerText = " Error al conectar con el servidor local.";
  }
}

function copiarContenido() {
  const resultado = document.getElementById("resultado").innerText;
  if (!resultado.trim()) {
    alert("No hay contenido para copiar.");
    return;
  }

  navigator.clipboard.writeText(resultado)
    .then(() => alert("Contenido copiado al portapapeles."))
    .catch(err => console.error("Error al copiar: ", err));
}


//funcion para descargar pdf

async function descargarPDF() {
  const resultado = document.getElementById("resultado").innerText;
  if (!resultado.trim()) {
    alert("No hay contenido para descargar.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const marginLeft = 10;
  const marginTop = 10;
  const pageHeight = doc.internal.pageSize.height;
  const lineHeight = 10;
  let y = marginTop;

  // Divide el texto para que se ajuste al ancho de la página
  const lineas = doc.splitTextToSize(resultado, 180); // 180 es el ancho de texto seguro

  lineas.forEach(linea => {
    if (y + lineHeight > pageHeight - marginTop) {
      doc.addPage();
      y = marginTop;
    }
    doc.text(linea, marginLeft, y);
    y += lineHeight;
  });

  doc.save("contenido_educativo.pdf");
}

//funcion para descargar el docx
function descargarWord() {
  const resultado = document.getElementById("resultado").innerText;
  if (!resultado.trim()) {
    alert("No hay contenido para descargar.");
    return;
  }

  const lines = resultado.split('\n');

  const doc = new window.docx.Document({
    sections: [{
      properties: {},
      children: lines.map(line => new window.docx.Paragraph(line))
    }]
  });

  window.docx.Packer.toBlob(doc).then(blob => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "contenido_educativo.docx";
    a.click();
  }).catch(error => {
    console.error("Error al generar Word:", error);
    alert(" Error al generar el archivo Word.");
  });
}

