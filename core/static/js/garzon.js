// NUMERO DE CLIENTES REGISTRAR COMANDA
function toggleDropdown() {
  const dropdown = document.getElementById("dropdown-numeros");
  const inputOtro = document.getElementById("input-otro");
  dropdown.classList.toggle("oculto");
  inputOtro.classList.add("oculto");
}

function seleccionarNumero(n) {
  document.getElementById("numero-seleccionado").textContent = n;
  document.getElementById("dropdown-numeros").classList.add("oculto");
}

function seleccionarOtro() {
  document.getElementById("input-otro").classList.remove("oculto");
}

function actualizarNumero(valor) {
  if (valor !== '') {
    document.getElementById("numero-seleccionado").textContent = valor;
  }
}

// EDITAR MESA REGISTRAR COMANDA
function toggleSelectorMesas() {
  document.getElementById("selector-mesas").classList.toggle("oculto");
}

function seleccionarMesa(nombre) {
  document.getElementById("mesa-seleccionada").innerHTML = `<strong>${nombre}</strong>`;
  document.getElementById("selector-mesas").classList.add("oculto");
}

// OCULTAR REGISTRAR COMANDA

function abrirCarta(nombreMesa) {
  document.getElementById('vista-mesas').classList.add('oculto');
  document.getElementById('vista-carta').classList.remove('oculto');
  document.getElementById('vista-carta').style.display = 'flex';
  document.querySelector('header').classList.add('oculto');

  const mesaSeleccionada = document.getElementById("mesa-seleccionada");
  if (mesaSeleccionada) {
    mesaSeleccionada.innerHTML = `<strong>${nombreMesa}</strong>`;
  }

  const inputMesa = document.getElementById("mesa-input");
  if (inputMesa) {
    inputMesa.value = nombreMesa;
  }

  const leftPanel = document.querySelector('.registrar-comanda-izquierda');
  const rightPanel = document.querySelector('.registrar-comanda-derecha');
  const resizer = document.querySelector('.registrar-comanda-centro');

  if (leftPanel && rightPanel && resizer) {
    const totalWidth = resizer.parentNode.offsetWidth;
    const initialLeft = Math.floor(totalWidth * 0.55);
    const initialRight = totalWidth - initialLeft - resizer.offsetWidth;

    leftPanel.style.width = `${initialLeft}px`;
    rightPanel.style.width = `${initialRight}px`;
  }

  fetch(`/obtener-pedido/?mesa=${encodeURIComponent(nombreMesa)}`)
    .then(response => response.json())
    .then(data => {
      const contenedor = document.getElementById('carrito');
      contenedor.innerHTML = "";

      const btnEnviar = document.getElementById("enviar-comanda");

      if (data.ok) {
        document.getElementById("total-precio").innerText = `$${data.total.toLocaleString("es-CL")}`;
        btnEnviar.disabled = true;
        btnEnviar.innerText = "Pedido enviado";

        const productos = data.detalle.split("\n\n");

        productos.forEach(prod => {
          const lineas = prod.split('\n').filter(l => l.trim() !== "");

          const nombre = lineas[0] || "";
          const acompIndex = lineas.indexOf("Acompañamientos");
          const ingreIndex = lineas.indexOf("Ingredientes");
          const precioIndex = lineas.indexOf("Precio");

          const acomp = (acompIndex !== -1 && lineas[acompIndex + 1]) ? lineas[acompIndex + 1] : "";
          const ingre = (ingreIndex !== -1 && lineas[ingreIndex + 1]) ? lineas[ingreIndex + 1] : "";
          const precio = (precioIndex !== -1 && lineas[precioIndex + 1]) ? lineas[precioIndex + 1] : "";

          const nuevoProducto = document.createElement('div');
          nuevoProducto.classList.add('registrar-comanda-carrito');
          nuevoProducto.innerHTML = `
            <div class="registrar-comanda-carrito-arriba">
              <h1>${nombre}</h1>
            </div>
            <div class="registrar-comanda-carrito-abajo">
              <h1>Acompañamientos</h1>
              <p>${acomp}</p>
              <h1>Ingredientes</h1>
              <p>${ingre}</p>
              <h1>Precio</h1>
              <p>${precio}</p>
            </div>
          `;
          contenedor.appendChild(nuevoProducto);
        });

      } else {
        document.getElementById("total-precio").innerText = "$0";
        btnEnviar.disabled = false;
        btnEnviar.innerText = "Enviar";
      }
    })
    .catch(error => {
      console.error("Error al obtener pedido:", error);
      alert("Error al cargar datos del pedido");
    });
}












function volver() {
  console.log("Volviendo a vista mesas");
  document.getElementById('vista-mesas').classList.remove('oculto');
  document.getElementById('vista-carta').classList.add('oculto');
  document.getElementById('vista-carta').style.display = 'none';
  document.querySelector('header').classList.remove('oculto');
}

// REZISER
const resizer = document.querySelector('.registrar-comanda-centro');
const leftPanel = document.querySelector('.registrar-comanda-izquierda');
const rightPanel = document.querySelector('.registrar-comanda-derecha');

let isResizing = false;

if (resizer) {
  resizer.addEventListener('mousedown', () => {
    isResizing = true;
    document.body.style.cursor = 'col-resize';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const offsetLeft = e.clientX;
    const totalWidth = resizer.parentNode.offsetWidth;
    const minLeft = 200;
    const maxLeft = totalWidth - 300;

    const newLeftWidth = Math.min(Math.max(offsetLeft, minLeft), maxLeft);
    leftPanel.style.width = `${newLeftWidth}px`;
    rightPanel.style.width = `${totalWidth - newLeftWidth - resizer.offsetWidth}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = 'default';
    }
  });
}

// FILTRAR PRODUCTOS POR CATEGORÍA
document.addEventListener('DOMContentLoaded', () => {
  const botones = document.querySelectorAll('.tabs-categorias button');
  const productos = document.querySelectorAll('.producto');

  function filtrarProductos(categoria) {
    productos.forEach(prod => {
      const cat = prod.getAttribute('data-categoria');
      prod.style.display = (cat === categoria) ? 'block' : 'none';
    });
  }

  const primeraCategoria = document.querySelector('.tabs-categorias .tab-activa')?.getAttribute('data-categoria');
  if (primeraCategoria) {
    filtrarProductos(primeraCategoria);
  }

  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      const categoriaSeleccionada = boton.getAttribute('data-categoria');
      botones.forEach(b => b.classList.remove('tab-activa'));
      boton.classList.add('tab-activa');
      filtrarProductos(categoriaSeleccionada);
    });
  });
});

// MOSTRAR MODAL DE PRODUCTO AL CLIC
function mostrarModal(productoId) {
  const modal = new bootstrap.Modal(document.getElementById(`modalProducto${productoId}`));
  modal.show();
}

// PRECIO + ACOMPAÑAMIENTOS MODAL

document.addEventListener('DOMContentLoaded', () => {
  const botonesAgregar = document.querySelectorAll('#agregar-modal');

  botonesAgregar.forEach(boton => {
    const modal = boton.closest('.modal');
    const productoId = modal.id.replace('modalProducto', '');
    const checkboxExtras = modal.querySelectorAll('.acompanamiento-extra');
    const precioBase = parseInt(boton.getAttribute('data-precio-base'), 10);

    function actualizarPrecio() {
      let total = precioBase;
      checkboxExtras.forEach(cb => {
        if (cb.checked) {
          total += parseInt(cb.dataset.precio, 10);
        }
      });
      boton.innerText = `Agregar $${total.toLocaleString('es-CL')}`;
    }

    checkboxExtras.forEach(cb => {
      cb.addEventListener('change', actualizarPrecio);
    });
  });
});

// AGREGAR CARRITO Y SUMAR PRECIOS

function formatearPrecio(valor) {
  return `$${valor.toLocaleString('es-CL')}`;
}

function obtenerTextoSeleccionado(selector) {
  return Array.from(document.querySelectorAll(selector))
    .filter(e => e.checked)
    .map(e => e.nextElementSibling.innerText)
    .join(', ');
}

function obtenerPrecioExtras(selector) {
  return Array.from(document.querySelectorAll(selector))
    .filter(e => e.checked)
    .reduce((acc, e) => acc + parseInt(e.dataset.precio || 0), 0);
}

function calcularTotal() {
  let total = 0;
  document.querySelectorAll('[data-precio-final]').forEach(item => {
    total += parseInt(item.dataset.precioFinal);
  });
  document.getElementById('total-precio').innerText = formatearPrecio(total);
}

document.querySelectorAll('#agregar-modal').forEach(boton => {
  boton.addEventListener('click', () => {
    const modal = boton.closest('.modal');
    const productoId = modal.id.replace('modalProducto', '');
    const nombreProducto = modal.querySelector('.contenedor-modal-items-centrados h1').innerText;
    const precioBase = parseInt(boton.getAttribute('data-precio-base'));
    const extrasSeleccionados = obtenerTextoSeleccionado(`#${modal.id} .acompanamiento-extra`);
    const ingredientesSeleccionados = obtenerTextoSeleccionado(`#${modal.id} .contenedor-ingredientes-modal input[type="checkbox"]`);
    const acompañamientoRadio = modal.querySelector(`input[name="acompanamiento-extra-${productoId}"]:checked`);
    const acompañamientoSimple = acompañamientoRadio ? acompañamientoRadio.nextElementSibling.innerText : '';

    const precioExtras = obtenerPrecioExtras(`#${modal.id} .acompanamiento-extra`);
    const precioFinal = precioBase + precioExtras;

    const contenedor = document.getElementById('carrito');
    const nuevoProducto = document.createElement('div');
    nuevoProducto.classList.add('registrar-comanda-carrito');
    nuevoProducto.setAttribute('data-precio-final', precioFinal);

    nuevoProducto.innerHTML = `
      <div class="registrar-comanda-carrito-arriba">
        <h1>${nombreProducto}</h1>
        <button onclick="this.closest('.registrar-comanda-carrito').remove(); calcularTotal();">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
      <div class="registrar-comanda-carrito-abajo">
        <h1>Acompañamientos</h1>
        <p>${acompañamientoSimple}${extrasSeleccionados ? ', ' + extrasSeleccionados : ''}</p>
        <h1>Ingredientes</h1>
        <p>${ingredientesSeleccionados}</p>
        <h1>Precio</h1>
        <p>${formatearPrecio(precioFinal)}</p>
      </div>
    `;

    contenedor.appendChild(nuevoProducto);
    calcularTotal();

    const instanciaModal = bootstrap.Modal.getInstance(modal);
    instanciaModal.hide();
  });
});

// PEDIDO

let contadorPedidos = 1;

document.getElementById("enviar-comanda").addEventListener("click", () => {
  const mesa = document.getElementById("mesa-seleccionada").innerText;
  const comensales = document.getElementById("numero-seleccionado").innerText;
  const garzon = "Franco"; // Nombre temporal

  const productos = Array.from(document.querySelectorAll(".registrar-comanda-carrito")).map((producto) => {
    return producto.innerText.trim();
  });

  const total = document.getElementById("total-precio").innerText.replace(/\D/g, "");

  const datos = {
    mesa,
    comensales: parseInt(comensales),
    garzon,
    detalle: productos.join("\n\n"),
    total: parseInt(total),
  };

  fetch("/registrar-pedido/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRFToken(),
    },
    body: JSON.stringify(datos),
  })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        const pedidoId = data.numero_pedido;
        crearTarjetaPedido(datos, pedidoId);
        alert("Pedido enviado correctamente");
      } else {
        console.error("Respuesta con error:", data);
        alert("Error al registrar el pedido: " + (data.error || "Error desconocido"));
      }
    })
    .catch(() => alert("Error de conexión con el servidor"));
});

function crearTarjetaPedido(datos, pedidoId) {
  const tarjeta = document.createElement("div");
  tarjeta.className = "tarjeta-pedido";
  tarjeta.setAttribute("data-pedido", pedidoId);
  tarjeta.setAttribute("data-tiempo", Date.now());

  tarjeta.innerHTML = `
    <div class="tarjeta-header estado-preparacion">
      <span>${horaActual()}</span>
      <span><i class="fa-solid fa-user"></i> ${datos.comensales}</span>
      <span id="tiempo-${pedidoId}">0m</span>
    </div>
    <div class="tarjeta-body">
      <h3 class="mesa-nombre">${datos.mesa}</h3>
      <p>Pedido ${pedidoId}</p>
    </div>
  `;

  const idMesa = datos.mesa.toLowerCase().replace(" ", "-");
  const divMesa = document.getElementById(idMesa);
  if (divMesa) {
    divMesa.innerHTML = tarjeta.innerHTML;
    divMesa.className = "mesa tarjeta-pedido";
    divMesa.setAttribute("data-pedido", pedidoId);
    divMesa.setAttribute("data-tiempo", Date.now());
  }

  actualizarTiempo(pedidoId);
}



function marcarEntregado(pedidoId, boton) {
  fetch("/registrar-pedido/", {
    method: "POST",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
  }).then(response => {
    if (response.ok) {
      const tarjeta = document.querySelector(`[data-pedido='${pedidoId}']`);
      tarjeta.querySelector(".tarjeta-header").classList.remove("naranja");
      tarjeta.querySelector(".tarjeta-header").classList.add("verde");
      tarjeta.querySelector(".tarjeta-header").children[1].innerText = "Entregado";
      boton.remove();
    }
  });
}

// TIEMPO QUE LLEVA EL PEDIDO

function actualizarTiempo(pedidoId) {
  const tiempoEl = document.getElementById(`tiempo-${pedidoId}`);
  const inicio = parseInt(document.querySelector(`[data-pedido='${pedidoId}']`).getAttribute("data-tiempo"));

  function actualizar() {
    const diff = Math.floor((Date.now() - inicio) / 1000);
    const horas = Math.floor(diff / 3600);
    const minutos = Math.floor((diff % 3600) / 60);
    const segundos = diff % 60;

    let texto = '';
    if (horas > 0) texto += `${horas}h `;
    if (minutos > 0 || horas > 0) texto += `${minutos}m `;
    texto += `${segundos}s`;

    tiempoEl.innerText = texto.trim();
  }

  actualizar();
  setInterval(actualizar, 1000);
}

// HORA ACTUAL EN LA QUE SE HIZO EL PEDIDO

function horaActual() {
  const ahora = new Date();
  return ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getCSRFToken() {
  const cookie = document.cookie.split(";").find(c => c.trim().startsWith("csrftoken="));
  return cookie ? cookie.split("=")[1] : "";
}

function iniciarTiemposDesdeServidor() {
  document.querySelectorAll('[id^="tiempo-"]').forEach(span => {
    const inicioStr = span.getAttribute('data-inicio');
    if (!inicioStr) return; // Solo aplica a los que vienen con data-inicio (servidor)

    const inicio = new Date(inicioStr);

    function actualizar() {
      const diff = Math.floor((Date.now() - inicio) / 1000);
      const horas = Math.floor(diff / 3600);
      const minutos = Math.floor((diff % 3600) / 60);
      const segundos = diff % 60;

      let texto = '';
      if (horas > 0) texto += `${horas}h `;
      if (minutos > 0 || horas > 0) texto += `${minutos}m `;
      texto += `${segundos}s`;

      span.textContent = texto.trim();
    }

    actualizar();
    setInterval(actualizar, 1000);
  });
}

function iniciarTiemposDesdeServidor() {
  const spans = document.querySelectorAll('[id^="tiempo-"]');

  spans.forEach(span => {
    const inicioStr = span.getAttribute('data-inicio');
    if (!inicioStr) {
      console.warn('Falta data-inicio en', span);
      return;
    }

    const inicio = new Date(inicioStr);
    if (isNaN(inicio.getTime())) {
      console.warn('Fecha inválida en data-inicio:', inicioStr);
      return;
    }

    function actualizar() {
      const ahora = new Date();
      const diff = Math.floor((ahora - inicio) / 1000); // segundos

      const horas = Math.floor(diff / 3600);
      const minutos = Math.floor((diff % 3600) / 60);
      const segundos = diff % 60;

      let texto = '';
      if (horas > 0) texto += `${horas}h `;
      if (minutos > 0 || horas > 0) texto += `${minutos}m `;
      texto += `${segundos}s`;

      span.textContent = texto.trim();
    }

    actualizar();
    setInterval(actualizar, 1000);
  });
}

document.addEventListener('DOMContentLoaded', iniciarTiemposDesdeServidor);



