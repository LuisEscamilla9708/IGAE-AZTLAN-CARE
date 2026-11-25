
// Busca los elementos de la página.
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// =====================================
// INICIO DE SESIÓN
// =====================================

// Permite entrar al sistema y muestra el rol seleccionado.
$('#login').onsubmit = e => {
    e.preventDefault();
    $('#usuario').textContent = $('#rol').value;
    $('#acceso').hidden = true;
    $('#sistema').hidden = false;
    e.target.reset();
};

// Cierra la sesión y regresa a la pantalla de acceso.
$('#salir').onclick = () => {
    if (confirm('¿Cerrar sesión?')) {
        $('#sistema').hidden = true;
        $('#acceso').hidden = false;
    }
};

// =====================================
// MENÚ PRINCIPAL
// =====================================

// Muestra el módulo seleccionado y oculta los demás.
$$('.menu-btn').forEach(b => b.onclick = () => {
    $$('.menu-btn').forEach(x => x.classList.toggle('activo', x === b));
    $$('.seccion').forEach(s => s.hidden = s.id !== b.dataset.section);
    $('#titulo').textContent = b.textContent;
});

// =====================================
// SUBMENÚS
// =====================================

// Muestra la opción seleccionada dentro de cada módulo.
$$('[data-tab]').forEach(b => b.onclick = () => {
    const s = b.closest('.seccion');
    s.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('activo', x === b));
    s.querySelectorAll('.vista').forEach(v => v.hidden = v.id !== b.dataset.tab);
    actualizarSelects();
    calendario();
});

// =====================================
// TABLAS Y REGISTROS
// =====================================

// Busca las tablas donde se mostrará la información.
const listas = k => [...$$(`[data-lista="${k}"]`)];

// Agrega una nueva fila con los datos registrados.
function fila(tabla, valores) {
    const r = tabla.insertRow();
    valores.forEach(v => r.insertCell().textContent = v);
}

// Guarda temporalmente los documentos que se suban.
const archivos = [];

// =====================================
// LISTAS DESPLEGABLES
// =====================================

// Actualiza las opciones con los registros que se van agregando.
function actualizarSelects() {

    $$('.referencia').forEach(s => {
        const anterior = s.value;
        s.replaceChildren(new Option('Seleccionar', ''));

        [...(listas(s.dataset.origen)[0]?.rows || [])].forEach(r => {
            s.add(new Option(r.cells[0].textContent));
        });

        s.value = [...s.options].some(o => o.value === anterior) ? anterior : '';
    });

    // Muestra los registros disponibles para consultar o editar.
    $$('.registros').forEach(s => {
        s.replaceChildren();

        [...(listas(s.dataset.origen)[0]?.rows || [])].forEach((r, i) => {
            s.add(new Option(r.cells[0].textContent, i));
        });
    });

    // Muestra los documentos que se han subido.
    $$('.archivos').forEach(s => {
        s.replaceChildren();
        archivos.forEach((f, i) => s.add(new Option(f.name, i)));
    });
}

// =====================================
// REGISTRAR Y EDITAR INFORMACIÓN
// =====================================

// Obtiene la información escrita en los formularios.
$$('form[data-modo]').forEach(f => f.onsubmit = e => {
    e.preventDefault();

    const controles = [...f.querySelectorAll('input,select')];
    const v = controles.map(x => x.value);
    const k = f.dataset.tabla;

    // Agrega un nuevo registro a las tablas.
    if (f.dataset.modo === 'alta') {
        listas(k).forEach(t => fila(t, v));
    }

    // Modifica la información de un registro existente.
    else if (f.dataset.modo === 'editar') {
        const i = f.closest('.vista').querySelector('.registros').value;

        if (i === '') return alert('No hay registros.');

        listas(k).forEach(t => {
            v.forEach((x, j) => t.rows[i].cells[j].textContent = x);
        });
    }

    // Agrega un documento y muestra su información.
    else if (f.dataset.modo === 'archivo') {
        const archivo = controles[1].files[0];
        archivos.push(archivo);

        listas(k).forEach(t => {
            fila(t, [archivo.name, v[0], new Date().toISOString().slice(0, 10)]);
        });
    }

    // Representa las funciones que todavía no están desarrolladas.
    else {
        alert('Acción simulada. No se guardaron datos.');
        f.reset();
        return;
    }

    // Limpia el formulario y actualiza la información.
    f.reset();
    actualizarSelects();
    calendario();
    alert('Cambio registrado durante esta sesión.');
});

// =====================================
// DESACTIVAR USUARIOS
// =====================================

// Cambia el estado del usuario seleccionado a inactivo.
$$('[data-baja]').forEach(b => b.onclick = () => {
    const i = b.closest('.vista').querySelector('.registros').value;

    if (i !== '' && confirm('¿Desactivar usuario?')) {
        listas(b.dataset.baja).forEach(t => {
            t.rows[i].cells[3].textContent = 'Inactivo';
        });
    }
});

// =====================================
// DESCARGAR ARCHIVOS
// =====================================

// Crea una descarga desde el navegador.
function descargar(blob, nombre) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nombre;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// =====================================
// GESTIÓN DE DOCUMENTOS
// =====================================

// Permite descargar o eliminar el documento seleccionado.
$$('[data-archivo]').forEach(b => b.onclick = () => {
    const i = b.closest('.vista').querySelector('select').value;

    if (i === '') return alert('No hay archivos.');

    // Descarga el documento seleccionado.
    if (b.dataset.archivo === 'descargar') {
        descargar(archivos[i], archivos[i].name);
    }

    // Elimina el documento de la lista y de la tabla.
    else if (confirm('¿Eliminar archivo?')) {
        archivos.splice(i, 1);
        listas('documentos').forEach(t => t.deleteRow(i));
        actualizarSelects();
    }
});

// =====================================
// EXPORTAR REPORTES
// =====================================

// Convierte la información de una tabla en un archivo CSV.
$$('[data-export]').forEach(b => b.onclick = () => {
    const csv = [...b.closest('.vista').querySelectorAll('tr')]
        .map(r => [...r.cells]
        .map(c => '"' + c.textContent.replaceAll('"', '""') + '"')
        .join(',')).join('\n');

    descargar(new Blob(['\ufeff', csv], {type: 'text/csv'}), 'reporte.csv');
});

// =====================================
// CALENDARIO DE ASIGNACIONES
// =====================================

// Muestra los días del mes y los servicios programados.
function calendario() {
    const c = $('#calendario');
    const [y, m] = $('#mes').value.split('-').map(Number);

    c.replaceChildren();

    if (!y || !m) return;

    // Coloca los nombres de los días de la semana.
    for (const d of ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']) {
        const b = document.createElement('b');
        b.textContent = d;
        c.append(b);
    }

    // Agrega los espacios antes del primer día del mes.
    for (let i = 0; i < (new Date(y, m - 1, 1).getDay() + 6) % 7; i++) {
        c.append(document.createElement('div'));
    }

    // Agrega todos los días del mes.
    for (let d = 1; d <= new Date(y, m, 0).getDate(); d++) {
        const el = document.createElement('div');
        el.textContent = d;

        const fecha = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

        // Busca si existen asignaciones para ese día.
        for (const r of listas('asignaciones')[0].rows) {
            if (r.cells[3].textContent === fecha) {
                const s = document.createElement('small');
                s.textContent = r.cells[0].textContent;
                el.append(s);
            }
        }

        c.append(el);
    }
}

// =====================================
// INICIALIZACIÓN DEL SISTEMA
// =====================================

// Obtiene la fecha actual para mostrar el mes correspondiente.
const hoy = new Date();

$('#mes').value = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;

// Actualiza el calendario cuando se selecciona otro mes.
$('#mes').onchange = calendario;

// Prepara las listas y el calendario al abrir el sistema.
actualizarSelects();
calendario();
