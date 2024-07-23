// ---------------- TUTORIAL -------------------
document.addEventListener('DOMContentLoaded', function() {
    const btnOpen = document.querySelector('.tutorial__btn');
    const overlay = document.querySelector('.tutorial__overlay');
    const btnClose = document.querySelector('#closeTutorial');

    btnOpen.addEventListener('click', function() {
        overlay.style.display = 'block';
    });

    btnClose.addEventListener('click', function() {
        overlay.style.display = 'none';
    });
});




// ------------------ CATEGORIAS -----------------------

document.addEventListener('DOMContentLoaded', function() {
    const categoriasButtons = document.querySelectorAll('.categorias__button');
    const comidasSections = document.querySelectorAll('.comidas');

    categoriasButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categoriaId = button.id;

            // Ocultar todas las secciones de comida excepto la que corresponde a la categoría seleccionada
            comidasSections.forEach(seccion => {
                if (categoriaId === 'todo' || seccion.id === categoriaId) {
                    seccion.style.display = 'flex'; // Mostrar la sección correspondiente
                } else {
                    seccion.style.display = 'none'; // Ocultar las demás secciones
                }
            });

            // Desplazamiento suave hacia el elemento con id="referencia"
            const referencia = document.getElementById('referencia');
            referencia.scrollIntoView({ behavior: 'smooth' });
        });
    });
});



// ---------------- lista de pedidos -------------------------





document.addEventListener('DOMContentLoaded', function() {
    const botonesComida = document.querySelectorAll('.comida__cta');
    const pedidoContainer = document.querySelector('.pedido__container');
    const nuevoLightbox = document.getElementById('nuevo-lightbox');
    const cerrarLightbox = document.getElementById('cerrar-lightbox');
    const enviarPedido = document.getElementById('pedido__enviar-nuevo');
    const mesaInput = document.getElementById('mesa-nuevo');
    const nombreInput = document.getElementById('nombre-nuevo');
    const mensajeInput = document.getElementById('mensaje-nuevo');
    const totalPedidoElement = document.getElementById('total');

    if (botonesComida.length > 0 && pedidoContainer && totalPedidoElement) {
        let totalAcumulado = 0; // Variable para almacenar el total acumulado de los pedidos
        const detallesPedido = []; // Array para almacenar los detalles del pedido

        botonesComida.forEach(function(boton) {
            boton.addEventListener('click', function(event) {
                event.preventDefault(); // Evitar comportamiento por defecto del botón (por ejemplo, enviar formulario)

                // Obtener los elementos relevantes del pedido actual
                const comida = this.parentElement.querySelector('.comida__name').textContent.trim();
                const cantidad = parseInt(this.parentElement.querySelector('.comidas__inputNumber').value, 10);
                const precioString = this.parentElement.querySelector('.comida__precio').textContent.trim();
                const precio = parseFloat(precioString.slice(1));

                // Validar que la cantidad sea un número válido y mayor que cero
                if (!isNaN(cantidad) && cantidad > 0) {
                    // Calcular el total
                    const total = cantidad * precio;

                    // Sumar al total acumulado
                    totalAcumulado += total;

                    // Actualizar el total acumulado en el contenedor
                    totalPedidoElement.textContent = `TOTAL: $${totalAcumulado}`;

                    // Crear un nuevo elemento para mostrar el detalle del pedido en el contenedor
                    const detallePedido = document.createElement('div');
                    detallePedido.classList.add('pedido__item');
                    detallePedido.innerHTML = `
                        <span class="pedido__cantidad">${cantidad}</span>
                        <span class="pedido__producto">${comida}</span>
                        <span class="pedido__precio">$${total}</span>
                    `;

                    // Agregar el botón "Quitar" al detalle del pedido
                    const botonQuitar = document.createElement('button');
                    botonQuitar.textContent = 'Quitar';
                    botonQuitar.classList.add('quitar__pedido');
                    detallePedido.appendChild(botonQuitar);

                    // Agregar el nuevo pedido al contenedor de pedidos
                    pedidoContainer.appendChild(detallePedido);

                    // Evento para quitar el pedido
                    botonQuitar.addEventListener('click', function() {
                        // Restar del total acumulado al quitar el pedido
                        totalAcumulado -= total;
                        totalPedidoElement.textContent = `TOTAL: $${totalAcumulado}`;
                        pedidoContainer.removeChild(detallePedido);

                        // Eliminar el detalle del pedido del array
                        const index = detallesPedido.indexOf(detallePedido);
                        if (index !== -1) detallesPedido.splice(index, 1);
                    });

                    // Agregar el detalle del pedido al array
                    detallesPedido.push(detallePedido);

                    // Mostrar mensaje emergente de "Pedido agregado"
                    mostrarMensaje('Pedido agregado');

                    // Limpiar el número de input después de agregar el pedido
                    this.parentElement.querySelector('.comidas__inputNumber').value = '';
                } else {
                    alert('Ingrese una cantidad válida.');
                }
            });
        });

        enviarPedido.addEventListener('click', function() {
            const phoneNumber = '543815411429';  // Tu número de teléfono en formato internacional sin el símbolo '+'
            const mesa = mesaInput.value;
            const nombre = nombreInput.value;
            const mensaje = mensajeInput.value;

            // Validar que se haya agregado al menos un pedido y que los campos obligatorios estén completos
            if (detallesPedido.length > 0 && mesa.trim() !== '' && nombre.trim() !== '') {
                // Construir el mensaje de confirmación para WhatsApp
                const mensajeConfirmacion = construirMensajeConfirmacion(mesa, nombre, mensaje, totalAcumulado, detallesPedido);

                // URL de WhatsApp con el mensaje codificado
                const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensajeConfirmacion)}`;

                // Abrir la URL de WhatsApp en una nueva pestaña
                window.open(whatsappURL, '_blank');

                // Mostrar mensaje de confirmación
                alert('Pedido enviado por WhatsApp');

                // Cerrar el lightbox después de enviar
                nuevoLightbox.style.display = 'none';

                // Limpiar los campos de entrada
                mesaInput.value = '';
                nombreInput.value = '';
                mensajeInput.value = '';

                // Limpiar el contenedor de pedidos
                pedidoContainer.innerHTML = '';
                totalPedidoElement.textContent = 'TOTAL: $0';
                totalAcumulado = 0;
                detallesPedido.length = 0;
            } else {
                alert('Agregue al menos un pedido y complete los campos requeridos.');
            }
        });

        cerrarLightbox.addEventListener('click', function() {
            nuevoLightbox.style.display = 'none';
        });

        // Función para mostrar un mensaje emergente por un período de tiempo y luego ocultarlo-----------
        function mostrarMensaje() {
            const mensajePopup = document.querySelector('.mensaje__popup');

            // Mostrar el mensaje emergente
            mensajePopup.style.display = 'block';
            mensajePopup.classList.add('show');

            // Ocultar el mensaje después de 2 segundos
            setTimeout(function() {
                mensajePopup.classList.remove('show');
                setTimeout(function() {
                    mensajePopup.style.display = 'none';
                }, 500); // Esperar a que la transición termine antes de ocultar el elemento
            }, 2000); // Remover el mensaje después de 2 segundos
        }

        // Función para agregar pedido
        function agregarPedido() {
            // Aquí va tu lógica para agregar el pedido a la lista
            console.log('Pedido agregado'); // Ejemplo de agregar pedido

            // Mostrar el mensaje emergente
            mostrarMensaje();
        }

        // Asignar el evento click al botón de agregar pedido
        document.querySelector('.comida__cta').addEventListener('click', agregarPedido);
        

    } else {
        console.error('No se encontraron botones de comida, el contenedor de pedido o el elemento para mostrar el total.');
    }

    // Función para construir el mensaje de confirmación para WhatsApp
    function construirMensajeConfirmacion(mesa, nombre, mensaje, totalAcumulado, detallesPedido) {
        let mensajeConfirmacion = '*¡Nuevo Pedido!:*\n';

        detallesPedido.forEach((detalle) => {
            const cantidad = detalle.querySelector('.pedido__cantidad').textContent.trim();
            const producto = detalle.querySelector('.pedido__producto').textContent.trim();
            mensajeConfirmacion += `${cantidad} ${producto}\n`;
        });

        mensajeConfirmacion += `
            *Información Adicional:*
            Mesa: ${mesa}
            Nombre: ${nombre}
            Preparación: ${mensaje}

            *TOTAL:* $${totalAcumulado}
            \n Tambien puedes abonar por transferencia: \n    *Alias*: lepa2024\n    *Cbu:* 00231005669870000000 \n\n *Recuerda adjuntar el comprobante por aqui*
        `;

        return mensajeConfirmacion;
    }
});









// ----------------- cerrar lightbox --------------


document.addEventListener('DOMContentLoaded', function() {
    const pedidoConfirmar = document.getElementById('pedido__confirmar');
    const nuevoLightbox = document.getElementById('nuevo-lightbox');
    const cerrarLightbox = document.getElementById('cerrar-lightbox');

    pedidoConfirmar.addEventListener('click', function() {
        nuevoLightbox.style.display = 'block';
    });

    cerrarLightbox.addEventListener('click', function() {
        nuevoLightbox.style.display = 'none';
    });
});
