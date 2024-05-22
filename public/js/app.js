let id_familia;
let id_sector;
let id_actividad;
let id_perfil;
let id_competencia;

let texto_familia;
let texto_sector;
let texto_actividad;
let texto_perfil;
let texto_competencia;


//funcion para obtener el texto de todos los select
function obtenerTextoSelect(seccion) {
    var selectElement = document.getElementById('Select-' + seccion);
    var selectText = selectElement.options[selectElement.selectedIndex].text;
    return selectText;
}

//acignar valores a las variables
function asignarValores() {
    texto_familia = obtenerTextoSelect('familia');
    texto_sector = obtenerTextoSelect('sector');
    texto_actividad = obtenerTextoSelect('actividad');
    texto_perfil = obtenerTextoSelect('perfil');
    texto_competencia = obtenerTextoSelect('competencia');
}


function decicion(seccion) {
    var select = document.getElementById('Select-' + seccion);
    if (seccion === 'familia') {
        id_familia ? cargarSelect('/sector/' + id_familia, 'sector') : cargarSelect('/sector/' + select.value, 'sector');
        document.getElementById('Otro-sector').style.display = 'none';
        document.getElementById('Otro-actividad').style.display = 'none';
        document.getElementById('Otro-perfil').style.display = 'none';
        document.getElementById('Select-actividad').innerHTML = '';
        document.getElementById('Select-perfil').innerHTML = '';
    } else if (seccion === 'sector') {
        id_sector ? cargarSelect('/actividad/' + id_sector, 'actividad') : cargarSelect('/actividad/' + select.value, 'actividad');
        document.getElementById('Otro-actividad').style.display = 'none';
        document.getElementById('Otro-perfil').style.display = 'none';
        document.getElementById('Select-perfil').innerHTML = '';
    } else if (seccion === 'actividad') {
        id_actividad ? cargarSelect('/perfil/' + id_actividad, 'perfil') : cargarSelect('/perfil/' + select.value, 'perfil');
        document.getElementById('Otro-perfil').style.display = 'none';
    } else if (seccion === 'perfil') {
        
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
    } else if (seccion === 'perfil') {
        id_actividad = id_actividad ? id_actividad : document.getElementById('Select-actividad').value;
        data = {
            nombre: info,
            id_actividad: id_actividad
        }
    }
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
                id_sector = data.id;
            } else if (seccion === 'actividad') {
                document.getElementById('Select-familia').disabled = true;
                document.getElementById('Select-sector').disabled = true;
                id_actividad = data.id;
            } else if (seccion === 'perfil') {
                document.getElementById('Select-familia').disabled = true;
                document.getElementById('Select-sector').disabled = true;
                document.getElementById('Select-actividad').disabled = true;
                id_perfil = data.id;
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
                if (select === 'familia' || select === 'sector' || select === 'actividad') {
                    selectCargar.innerHTML = '';
                    let option = document.createElement('option');
                    option.value = 'nuevo';
                    option.text = 'Nuevo ' + select;
                    selectCargar.appendChild(option);
                    selectCargar.value = 'nuevo';
                    mostrarInputOtro(select);
                    return;
                } else {
                    //preguntar a chatGPT
                    // let pregunta = {
                    //     pregunta: '¿Qué competencia deseas agregar?'
                    // }
                    // preguntarChatGPT(pregunta);
                }
                
            }
            data.data.forEach(element => {
                let option = document.createElement('option');
                option.value = element.id;
                option.text = element.nombre;
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

//funcion para preguntar a chatGPT
function preguntarChatGPT(pregunta) {
    console.log('preguntarChatGPT');
fetch('/chatGPT', {
    method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(pregunta)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        notyf.error(error.message);
    });
}
