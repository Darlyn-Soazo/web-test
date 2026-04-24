const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", async function(evento) {
  evento.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;
  const mensaje = document.getElementById("mensaje").value;

  if (nombre === "" || correo === "" || mensaje === "") {
    alert("Debe completar todos los campos");
    return;
  }

  await fetch("/guardar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nombre, correo, mensaje })
  });

  formulario.reset();
  cargarDatos();
});

async function cargarDatos() {
  const respuesta = await fetch("/listar");
  const datos = await respuesta.json();

  const tabla = document.getElementById("tablaDatos");
  tabla.innerHTML = "";

  datos.forEach(item => {
    tabla.innerHTML += `
      <tr>
        <td>${item.nombre}</td>
        <td>${item.correo}</td>
        <td>${item.mensaje}</td>
      </tr>
    `;
  });
}

cargarDatos();
