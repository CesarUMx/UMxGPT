let id_familia;
let id_sector;

function decicion(seccion) {
    var select = document.getElementById('Select-' + seccion);
    if (seccion === 'familia') {
        id_familia ? cargarSelect('/sector/' + id_familia, 'sector') : cargarSelect('/sector/' + select.value, 'sector');
        document.getElementById('Otro-sector').style.display = 'none';
        document.getElementById('Otro-actividad').style.display = 'none';
        document.getElementById('Select-actividad').innerHTML = '';
    } else if (seccion === 'sector') {
        id_sector ? cargarSelect('/actividad/' + id_sector, 'actividad') : cargarSelect('/actividad/' + select.value, 'actividad');
        document.getElementById('Otro-actividad').style.display = 'none';
    }
}

function mostrarInputOtro(seccion) {
    var select = document.getElementById('Select-' + seccion);
    var inputOtro = document.getElementById('Otro-' + seccion);
    inputOtro.style.display = 'none';
    console.log(select.value);
    if (select.value === 'otro' || select.value === 'nuevo') {
        inputOtro.style.display = 'block';
    } else {
        decicion(seccion);
    }
}

function enviarInfo(seccion) {
    let info = document.getElementById('input-' + seccion).value;
    info = convertirAMayusculas(info);
    let data;

    if (seccion === 'familia') {
        data = {
            nombre: info
        }
    } else if (seccion === 'sector') {
        id_familia = id_familia ? id_familia : document.getElementById('Select-familia').value;
        data = {
            nombre: info,
            id_familia: id_familia
        }
    } else if (seccion === 'actividad') {
        id_sector = id_sector ? id_sector : document.getElementById('Select-sector').value;
        data = {
            nombre: info,
            id_sector: id_sector
        }
    };
    enviarOtro('/guardar-' + seccion, data, seccion);
};

function convertirAMayusculas(palabra) {
    var texto = palabra;
    // Convertir a mayúsculas
    texto = texto.toUpperCase();
    // Eliminar acentos y diacríticos
    texto = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Actualizar el valor del campo de entrada
    return texto;
}

// funcion enviar por fech
function enviarOtro (url, datos, seccion) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success === true) {
            notyf.success(data.message);
            let btn = document.getElementById('btn-' + seccion);
            btn.style.display = 'none';
            let input = document.getElementById('input-' + seccion);
            input.disabled = true;
            let select = document.getElementById('Select-' + seccion);
            select.disabled = true;
            if (seccion === 'familia') {
                id_familia = data.id;
            } else if (seccion === 'sector') {
                document.getElementById('Select-familia').disabled = true;
            } else if (seccion === 'actividad') {
                document.getElementById('Select-familia').disabled = true;
                document.getElementById('Select-sector').disabled = true;
            }
        } else {
            notyf.error(data.message);
        }
    })
    .catch(error => {
        notyf.error(error.message);
    });
}

//cargar select
function cargarSelect(url, select) {
    console.log('cargarSelect' + select);
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success === true) {
            let selectCargar = document.getElementById('Select-' + select);
            selectCargar.innerHTML = '';
            let option1 = document.createElement('option');
            option1.value = '';
            option1.text = 'Seleccione una opción';
            selectCargar.appendChild(option1);
            if (data.data.length === 0) {
                selectCargar.innerHTML = '';
                let option = document.createElement('option');
                option.value = 'nuevo';
                option.text = 'Nuevo ' + select;
                selectCargar.appendChild(option);
                selectCargar.value = 'nuevo';
                mostrarInputOtro(select);
                return;
            }
            data.data.forEach(element => {
                let option = document.createElement('option');
                if (select === 'sector') {
                    option.value = element.Id;
                    option.text = element.Nombre;
                }
                if (select === 'actividad') {
                    option.value = element.id;
                    option.text = element.nombre;
                }
                selectCargar.appendChild(option);
            });
            let option = document.createElement('option');
            option.value = 'otro';
            option.text = 'Otro';
            selectCargar.appendChild(option);
        } else {
            notyf.error(data.message);
        }
    })
    .catch(error => {
        notyf.error(error.message);
    });
}
