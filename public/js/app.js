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

let loading = document.getElementById('loaderDiv');


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
    //si el valor es otro asignar valor del input
    if (texto_familia === 'Otro') {
        texto_familia = document.getElementById('input-familia').value;
    }
    if (texto_sector === 'Otro') {
        texto_sector = document.getElementById('input-sector').value;
    }
    if (texto_actividad === 'Otro') {
        texto_actividad = document.getElementById('input-actividad').value;
    }
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
    enviarOtro('/guardar-' + seccion, data, seccion, 'otro');
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
function enviarOtro(url, datos, seccion, type) {
    loading.style.display = 'flex';
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
            if (type === 'otro') {
                if (data.success === true) {
                    notyf.success(data.message);
                    loading.style.display = 'none';
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
                    decicion(seccion);
                } else {
                    notyf.error(data.message);
                    loading.style.display = 'none';
                }
            } else if (type === 'perfil') {
                if (data.success === true) {
                    console.log('perfil guardado');
                } else {
                    notyf.error(data.message);
                    loading.style.display = 'none';
                }
            }
        })
        .catch(error => {
            notyf.error(error.message);
            loading.style.display = 'none';
        });
}

//cargar select
async function cargarSelect(url, select) {
    loading.style.display = 'flex';
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        const data = await response.json();

        if (data.success === true) {
            let selectCargar = document.getElementById('Select-' + select);
            selectCargar.innerHTML = '';
            selectCargar.appendChild(new Option('Seleccione una opción', ''));

            console.log(data.data);
            if (data.data.length === 0) {
                await handleEmptySelect(select, selectCargar);
            } else {
                data.data.forEach(element => {
                    selectCargar.appendChild(new Option(element.nombre, element.id));
                });
                selectCargar.appendChild(new Option('Otro', 'otro'));
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        notyf.error(error.message);
    } finally {
        loading.style.display = 'none';
    }
}

async function handleEmptySelect(select, selectCargar) {
    console.log(select);
    if (['familia', 'sector', 'actividad'].includes(select)) {
        selectCargar.innerHTML = '';
        selectCargar.appendChild(new Option('Nuevo ' + select, 'nuevo'));
        selectCargar.value = 'nuevo';
        mostrarInputOtro(select);
        loading.style.display = 'none';
    } else if (select === 'perfil') {
        await asignarValores();
        let pregunta = {
            pregunta: 'Para la actividad de: ' + texto_actividad + ' perteneciente al sector de: ' + texto_sector + ' y a la familia de: ' + texto_familia + ' Identifica solo los nombres de los perfiles de puestos (solo el nombre sin descripción) basada en la estructura típica organizacional del país vasco en España relacionados a esta actividad empezando desde el puesto más bajo hasta antes de puestos de tomadores de decisiones como supervisor y/o coordinador. Solo dame los nombres de los perfiles de puestos, separados por comas. Ejemplo: operario, técnico, analista, etc. No uses caracteres especiales ni abreviaturas.'
        };
        var list_perfiles = await preguntarChatGPT(pregunta);
        var array_perfiles = await convertirStringAArray(list_perfiles);

        //guardar perfiles en la base de datos y cargarlos en el select       
        if (array_perfiles) {
            array_perfiles.forEach(async function (perfil) {
                perfil = convertirAMayusculas(perfil);
                let data = {
                    nombre: perfil,
                    id_actividad: id_actividad ? id_actividad : document.getElementById('Select-actividad').value
                }
                console.log(data);
                await enviarOtro('/guardar-perfil', data, 'perfil', 'perfil');
            });

            await cargarSelect('/perfil/' + id_actividad, 'perfil');
        }
    }
}

//funcion para preguntar a chatGPT
async function preguntarChatGPT(pregunta) {
    loading.style.display = 'flex';
    try {
        const response = await fetch('/chatGPT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(pregunta)
        });

        const data = await response.json(); // Espera a que la respuesta se convierta en JSON

        if (data.success) {
            return data.data; // Retorna los datos si la petición fue exitosa
        } else {
            notyf.error(data.message); // Muestra un mensaje de error
            return null; // Retorna null si hubo un error
        }
    } catch (error) {
        console.error(error);
        notyf.error(error.message);
        return null; // Retorna null en caso de errores en la petición
    } finally {
        loading.style.display = 'none'; // Asegura que el loading siempre se oculta
    }
}

//funcion para convertir de string a array
function convertirStringAArray(string) {
    return string.split(', ');
}
