// =====================================
// NAVEGACIÓN DEL MENÚ
// =====================================

const botonesMenu = document.querySelectorAll(".menu-btn");

const secciones = document.querySelectorAll(".seccion");

const tituloPagina = document.getElementById("tituloPagina");


botonesMenu.forEach(function(boton) {

    boton.addEventListener("click", function() {

        // Quitar el botón activo
        botonesMenu.forEach(function(btn) {
            btn.classList.remove("activo");
        });

        // Activar botón seleccionado
        boton.classList.add("activo");


        // Ocultar todas las secciones
        secciones.forEach(function(seccion) {
            seccion.classList.remove("activa");
        });


        // Buscar sección seleccionada
        const nombreSeccion =
            boton.getAttribute("data-section");


        const seccionSeleccionada =
            document.getElementById(nombreSeccion);


        // Mostrar sección
        seccionSeleccionada.classList.add("activa");


        // Cambiar título
        tituloPagina.textContent =
            boton.textContent.trim();

    });

});


// =====================================
// REGISTRAR USUARIO
// =====================================

const formUsuario =
    document.getElementById("formUsuario");


formUsuario.addEventListener("submit", function(evento) {

    evento.preventDefault();


    const nombre =
        document.getElementById("nombreUsuario").value;

    const correo =
        document.getElementById("correoUsuario").value;

    const rol =
        document.getElementById("rolUsuario").value;


    const tabla =
        document.getElementById("tablaUsuarios");


    const nuevaFila =
        document.createElement("tr");


    nuevaFila.innerHTML = `
        <td>${nombre}</td>
        <td>${correo}</td>
        <td>${rol}</td>
        <td>Activo</td>
    `;


    tabla.appendChild(nuevaFila);


    alert("Usuario registrado correctamente");


    formUsuario.reset();

});


// =====================================
// REGISTRAR PACIENTE
// =====================================

const formPaciente =
    document.getElementById("formPaciente");


formPaciente.addEventListener("submit", function(evento) {

    evento.preventDefault();


    const nombre =
        document.getElementById("nombrePaciente").value;

    const edad =
        document.getElementById("edadPaciente").value;

    const telefono =
        document.getElementById("telefonoPaciente").value;

    const diagnostico =
        document.getElementById("diagnosticoPaciente").value;


    const tabla =
        document.getElementById("tablaPacientes");


    const nuevaFila =
        document.createElement("tr");


    nuevaFila.innerHTML = `
        <td>${nombre}</td>
        <td>${edad}</td>
        <td>${telefono}</td>
        <td>${diagnostico}</td>
    `;


    tabla.appendChild(nuevaFila);


    alert("Paciente registrado correctamente");


    formPaciente.reset();

});


// =====================================
// REGISTRAR SERVICIO
// =====================================

const formServicio =
    document.getElementById("formServicio");


formServicio.addEventListener("submit", function(evento) {

    evento.preventDefault();


    const nombre =
        document.getElementById("nombreServicio").value;

    const descripcion =
        document.getElementById("descripcionServicio").value;


    const tabla =
        document.getElementById("tablaServicios");


    const nuevaFila =
        document.createElement("tr");


    nuevaFila.innerHTML = `
        <td>${nombre}</td>
        <td>${descripcion}</td>
    `;


    tabla.appendChild(nuevaFila);


    alert("Servicio registrado correctamente");


    formServicio.reset();

});


// =====================================
// MENSAJES GENERALES
// =====================================

function mensaje(texto) {

    alert(texto);

}


// =====================================
// CERRAR SESIÓN
// =====================================

function cerrarSesion() {

    const confirmar =
        confirm("¿Deseas cerrar la sesión?");


    if (confirmar) {

        alert("Sesión cerrada");

    }

}