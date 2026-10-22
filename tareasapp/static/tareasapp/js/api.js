const API_BASE = '/api/';

function obtenerToken() {
  return sessionStorage.getItem('token');
}

function guardarSesion(token, email) {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('email', email);
}

function cerrarSesion() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('email');
  window.location.href = '/login/';
}

function requerirSesion() {
  if (!obtenerToken()) {
    window.location.href = '/login/';
    return false;
  }
  return true;
}

async function llamarApi(ruta, metodo = 'GET', cuerpo = null) {
  const cabeceras = { 'Content-Type': 'application/json' };
  const token = obtenerToken();
  if (token) {
    cabeceras['Authorization'] = 'Token ' + token;
  }

  const respuesta = await fetch(API_BASE + ruta, {
    method: metodo,
    headers: cabeceras,
    body: cuerpo ? JSON.stringify(cuerpo) : null,
  });

  let datos = null;
  if (respuesta.status !== 204) {
    try {
      datos = await respuesta.json();
    } catch (e) {
      datos = null;
    }
  }

  // Si el token ya no sirve, se cierra la sesión
  if (respuesta.status === 401 && token) {
    cerrarSesion();
  }

  return { ok: respuesta.ok, status: respuesta.status, datos };
}

function textoError(datos) {
  if (!datos) return 'Ocurrió un error inesperado.';
  if (typeof datos === 'string') return datos;
  return Object.values(datos).flat().join(' ');
}

function mostrarMensaje(texto, tipo) {
  const caja = document.getElementById('mensaje');
  if (!caja) return;
  caja.textContent = texto;
  caja.className = 'mensaje ' + tipo;
}

function pintarNav() {
  const nav = document.getElementById('nav-sesion');
  if (!nav) return;

  if (obtenerToken()) {
    nav.innerHTML = '<a href="/">Inicio</a><a href="/crear/">Crear</a><a href="#" id="salir">Cerrar sesión</a>';
    document.getElementById('salir').addEventListener('click', (e) => {
      e.preventDefault();
      cerrarSesion();
    });
  } else {
    nav.innerHTML = '<a href="/login/">Iniciar sesión / Crear cuenta</a>';
  }
}

function crearEnlace(texto, href) {
  const a = document.createElement('a');
  a.className = 'boton';
  a.href = href;
  a.textContent = texto;
  return a;
}

function textoEstado(completada) {
  return completada ? 'Completada ✅' : 'Pendiente ⏳';
}

async function eliminarTarea(id) {
  if (!confirm('¿Seguro que quieres eliminar esta tarea?')) return null;
  const r = await llamarApi('tareas/' + id + '/', 'DELETE');
  return r.ok;
}

document.addEventListener('DOMContentLoaded', pintarNav);