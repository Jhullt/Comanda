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
