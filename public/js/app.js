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

let loading = document.getElementById("loaderDiv");
let loading2 = document.getElementById("loaderDes");

//funcion para obtener el texto de todos los select
function obtenerTextoSelect(seccion) {
    var selectElement = document.getElementById("Select-" + seccion);
    if (selectElement && selectElement.selectedIndex !== -1) {
        var selectText =
            selectElement.options[selectElement.selectedIndex].text;
        return selectText;
    }
    return "vacio";
}

//acignar valores a las variables
function asignarValores() {
    texto_familia = obtenerTextoSelect("familia");
    texto_sector = obtenerTextoSelect("sector");
    texto_actividad = obtenerTextoSelect("actividad");
    texto_perfil = obtenerTextoSelect("perfil");
    texto_competencia = obtenerTextoSelect("competencia");
    //si el valor es otro asignar valor del input
    if (texto_familia === "Otro") {
        texto_familia = document.getElementById("input-familia").value;
    }
    if (texto_sector === "Otro") {
        texto_sector = document.getElementById("input-sector").value;
    }
    if (texto_actividad === "Otro") {
        texto_actividad = document.getElementById("input-actividad").value;
    }
    if (texto_perfil === "Otro") {
        texto_perfil = document.getElementById("input-perfil").value;
    }
    if (texto_competencia === "Otro") {
        texto_competencia = document.getElementById("input-competencia").value;
    }
}

function decicion(seccion) {
    var select = document.getElementById("Select-" + seccion);
    if (seccion === "familia") {
        id_familia
            ? cargarSelect("/sector/" + id_familia, "sector")
            : cargarSelect("/sector/" + select.value, "sector");
        document.getElementById("Otro-sector").style.display = "none";
        document.getElementById("Otro-actividad").style.display = "none";
        document.getElementById("Select-actividad").innerHTML = "";
        document.getElementById("Otro-perfil").style.display = "none";
        document.getElementById("Select-perfil").innerHTML = "";
        document.getElementById("Otro-competencia").style.display = "none";
        document.getElementById("Select-competencia").innerHTML = "";
    } else if (seccion === "sector") {
        id_sector
            ? cargarSelect("/actividad/" + id_sector, "actividad")
            : cargarSelect("/actividad/" + select.value, "actividad");
        document.getElementById("Otro-actividad").style.display = "none";
        document.getElementById("Otro-perfil").style.display = "none";
        document.getElementById("Select-perfil").innerHTML = "";
        document.getElementById("Otro-competencia").style.display = "none";
        document.getElementById("Select-competencia").innerHTML = "";
    } else if (seccion === "actividad") {
        id_actividad
            ? cargarSelect("/perfil/" + id_actividad, "perfil")
            : cargarSelect("/perfil/" + select.value, "perfil");
        document.getElementById("Otro-perfil").style.display = "none";
        document.getElementById("Otro-competencia").style.display = "none";
        document.getElementById("Select-competencia").innerHTML = "";
    } else if (seccion === "perfil") {
        id_perfil
            ? cargarSelect("/competencia/" + id_perfil, "competencia")
            : cargarSelect("/competencia/" + select.value, "competencia");
        document.getElementById("Otro-competencia").style.display = "none";
    } else if (seccion === "competencia") {
        //todos los select cargados se deshabilitan y los input tambien
        document.getElementById("Select-familia").disabled = true;
        document.getElementById("Select-sector").disabled = true;
        document.getElementById("Select-actividad").disabled = true;
        document.getElementById("Select-perfil").disabled = true;
        document.getElementById("Select-competencia").disabled = true;
        document.getElementById("input-familia").disabled = true;
        document.getElementById("input-sector").disabled = true;
        document.getElementById("input-actividad").disabled = true;
        document.getElementById("input-perfil").disabled = true;
        document.getElementById("input-competencia").disabled = true;
        mostrarDescripcion();
    }
}

function mostrarInputOtro(seccion) {
    var select = document.getElementById("Select-" + seccion);
    var inputOtro = document.getElementById("Otro-" + seccion);
    inputOtro.style.display = "none";
    if (select.value === "otro" || select.value === "nuevo") {
        inputOtro.style.display = "block";
    } else {
        decicion(seccion);
    }
}

function enviarInfo(seccion) {
    let info = document.getElementById("input-" + seccion).value;
    info = convertirAMayusculas(info);
    let data;

    if (seccion === "familia") {
        data = {
            nombre: info,
        };
    } else if (seccion === "sector") {
        id_familia = id_familia
            ? id_familia
            : document.getElementById("Select-familia").value;
        data = {
            nombre: info,
            id_familia: id_familia,
        };
    } else if (seccion === "actividad") {
        id_sector = id_sector
            ? id_sector
            : document.getElementById("Select-sector").value;
        data = {
            nombre: info,
            id_sector: id_sector,
        };
    } else if (seccion === "perfil") {
        id_actividad = id_actividad
            ? id_actividad
            : document.getElementById("Select-actividad").value;
        data = {
            nombre: info,
            id_actividad: id_actividad,
        };
    } else if (seccion === "competencia") {
        id_perfil = id_perfil
            ? id_perfil
            : document.getElementById("Select-perfil").value;
        data = {
            nombre: info,
            id_perfil: id_perfil,
        };
    }
    enviarOtro("/guardar-" + seccion, data, seccion, "otro");
}

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
    loading.style.display = "flex";
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content"),
            "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(datos),
    })
        .then((response) => response.json())
        .then((data) => {
            if (type === "otro") {
                if (data.success === true) {
                    notyf.success(data.message);
                    loading.style.display = "none";
                    let btn = document.getElementById("btn-" + seccion);
                    btn.style.display = "none";
                    let input = document.getElementById("input-" + seccion);
                    input.disabled = true;
                    let select = document.getElementById("Select-" + seccion);
                    select.disabled = true;
                    if (seccion === "familia") {
                        id_familia = data.id;
                    } else if (seccion === "sector") {
                        document.getElementById(
                            "Select-familia"
                        ).disabled = true;
                        id_sector = data.id;
                    } else if (seccion === "actividad") {
                        document.getElementById(
                            "Select-familia"
                        ).disabled = true;
                        document.getElementById(
                            "Select-sector"
                        ).disabled = true;
                        id_actividad = data.id;
                    } else if (seccion === "perfil") {
                        document.getElementById(
                            "Select-familia"
                        ).disabled = true;
                        document.getElementById(
                            "Select-sector"
                        ).disabled = true;
                        document.getElementById(
                            "Select-actividad"
                        ).disabled = true;
                        id_perfil = data.id;
                    } else if (seccion === "competencia") {
                        document.getElementById(
                            "Select-familia"
                        ).disabled = true;
                        document.getElementById(
                            "Select-sector"
                        ).disabled = true;
                        document.getElementById(
                            "Select-actividad"
                        ).disabled = true;
                        document.getElementById(
                            "Select-perfil"
                        ).disabled = true;
                        id_competencia = data.id;
                    }
                    decicion(seccion);
                } else {
                    notyf.error(data.message);
                    loading.style.display = "none";
                }
            } else if (type === "perfil") {
                if (data.success === true) {
                    console.log("perfil guardado");
                } else {
                    notyf.error(data.message);
                    loading.style.display = "none";
                }
            } else if (type === "competencia") {
                if (data.success === true) {
                    console.log("competencia guardada");
                } else {
                    notyf.error(data.message);
                    loading.style.display = "none";
                }
            }
        })
        .catch((error) => {
            notyf.error(error.message);
            loading.style.display = "none";
        });
}

//cargar select
async function cargarSelect(url, select) {
    loading.style.display = "flex";
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
                "X-Requested-With": "XMLHttpRequest",
            },
        });

        const data = await response.json();

        if (data.success === true) {
            let selectCargar = document.getElementById("Select-" + select);
            selectCargar.innerHTML = "";
            selectCargar.appendChild(new Option("Seleccione una opción", ""));

            if (data.data.length === 0) {
                await handleEmptySelect(select, selectCargar);
            } else {
                data.data.forEach((element) => {
                    selectCargar.appendChild(
                        new Option(element.nombre, element.id)
                    );
                });
                selectCargar.appendChild(new Option("Otro", "otro"));
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        notyf.error(error.message);
    } finally {
        loading.style.display = "none";
    }
}

async function handleEmptySelect(select, selectCargar) {
    if (["familia", "sector", "actividad"].includes(select)) {
        selectCargar.innerHTML = "";
        selectCargar.appendChild(new Option("Nuevo " + select, "nuevo"));
        selectCargar.value = "nuevo";
        mostrarInputOtro(select);
        loading.style.display = "none";
    } else if (select === "perfil") {
        await asignarValores();
        let pregunta = {
            pregunta:
                "Para la actividad de: " +
                texto_actividad +
                " perteneciente al sector de: " +
                texto_sector +
                " y a la familia de: " +
                texto_familia +
                " Identifica solo los nombres de los perfiles de puestos (solo el nombre sin descripción) basada en la estructura típica organizacional del país vasco en España relacionados a esta actividad empezando desde el puesto más bajo hasta antes de puestos de tomadores de decisiones como supervisor y/o coordinador. Solo dame los nombres de los perfiles de puestos, separados por comas. Ejemplo: operario, técnico, analista, etc. No uses caracteres especiales ni abreviaturas y sin el punto final.",
        };
        var list_perfiles = await preguntarChatGPT(pregunta);
        var array_perfiles = await convertirStringAArray(list_perfiles);
        //guardar perfiles en la base de datos y cargarlos en el select
        if (array_perfiles) {
            array_perfiles.forEach(async function (perfil) {
                perfil = convertirAMayusculas(perfil);
                let data = {
                    nombre: perfil,
                    id_actividad: id_actividad
                        ? id_actividad
                        : document.getElementById("Select-actividad").value,
                };
                await enviarOtro("/guardar-perfil", data, "perfil", "perfil");
            });
            loading.style.display = "flex";
            await new Promise((resolve) => setTimeout(resolve, 2000));

            await cargarSelect(
                id_actividad
                    ? "/perfil/" + id_actividad
                    : "/perfil/" +
                          document.getElementById("Select-actividad").value,
                "perfil"
            );
        }
    } else if (select === "competencia") {
        await asignarValores();
        let pregunta = {
            pregunta:
                "Para el perfil de: " +
                texto_perfil +
                " perteneciente a la actividad de: " +
                texto_actividad +
                " y al sector de: " +
                texto_sector +
                " y a la familia de: " +
                texto_familia +
                "  redacta 5 competencias técnica (solo el nombre sin descripción), teniendo en cuenta que una competencia técnica se refiere a la habilidad o conocimiento específico necesario para llevar a cabo una tarea o trabajo en un campo particular. Estas competencias están relacionadas con habilidades técnicas específicas y conocimientos especializados en un área concreta y que de forma general abarquen y engloben todas las competencias técnicas necesarias para el correcto desempeño de: " +
                texto_perfil +
                ", separados por comas y sin numeracion, ni formato de lista. Ejemplo: Gestión de Archivos y Documentos, Ofimática y Gestión de Información, etc. No uses caracteres especiales ni abreviaturas y sin el punto final.",
        };
        var list_competencias = await preguntarChatGPT(pregunta);
        var array_competencias = await convertirStringAArray(list_competencias);

        //guardar competencias en la base de datos y cargarlos en el select
        if (array_competencias) {
            array_competencias.forEach(async function (competencia) {
                competencia = convertirAMayusculas(competencia);
                let data = {
                    nombre: competencia,
                    id_perfil: id_perfil
                        ? id_perfil
                        : document.getElementById("Select-perfil").value,
                };
                await enviarOtro(
                    "/guardar-competencia",
                    data,
                    "competencia",
                    "competencia"
                );
            });
            loading.style.display = "flex";
            //esperar 2 segundos para que se guarden las competencias
            await new Promise((resolve) => setTimeout(resolve, 2000));

            await cargarSelect(
                id_perfil
                    ? "/competencia/" + id_perfil
                    : "/competencia/" +
                          document.getElementById("Select-perfil").value,
                "competencia"
            );
        }
    }
}

//funcion para preguntar a chatGPT
async function preguntarChatGPT(pregunta) {
    loading.style.display = "flex";
    try {
        const response = await fetch("/chatGPT", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
                "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify(pregunta),
        });

        const data = await response.json(); // Espera a que la respuesta se convierta en JSON

        if (data.success) {
            return data.data; // Retorna los datos si la petición fue exitosa
        } else {
            notyf.error(data.message); // Muestra un mensaje de error
            return null; // Retorna null si hubo un error
        }
    } catch (error) {
        console.error(error.message);
        notyf.error(error.message);
        return null; // Retorna null en caso de errores en la petición
    } finally {
        loading.style.display = "none"; // Asegura que el loading siempre se oculta
    }
}

//funcion para convertir de string a array
function convertirStringAArray(string) {
    return string.split(", ");
}

/*
** funcion para mostrar la descripcion
** de la competencia, mandando a llamar desde BD
** si el campo llega vacio se pregunta a chatGPT
** la respuesta se guarda en la BD
*/
async function mostrarDescripcion() {
    loading2.style.display = "flex";
    let data = {
        id: id_competencia
            ? id_competencia
            : document.getElementById("Select-competencia").value,
    };
    try {
        const response = await fetch("/descripcion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
                "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify(data),
        });

        const res = await response.json();

        if (res.success === true) {
            //mostar descripcion
            document.getElementById("Descripcion").style.display = "block";
            //pintar descripcion
            document.getElementById("text_descripcion").innerHTML = res.descripcion;
        } else {
            //preguntar a chatGPT
            asignarValores();
            let pregunta = {
                pregunta:
                    "Para la competencia de: " +
                    texto_competencia +
                    " perteneciente al perfil de: " +
                    texto_perfil +
                    " y a la actividad de: " +
                    texto_actividad +
                    " y al sector de: " +
                    texto_sector +
                    " y a la familia de: " +
                    texto_familia +
                    " Redacta su descripción con no mas de 150 palabras de la competencia técnica en presente indicativo" +
                    " No uses caracteres especiales ni abreviaturas.",
            };
            var descripcion = await preguntarChatGPT(pregunta);
            if (descripcion) {
                //guardar descripcion
                let data = {
                    id: id_competencia
                        ? id_competencia
                        : document.getElementById("Select-competencia").value,
                    descripcion: descripcion,
                };
                await fetch("/guardar-descripcion", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    body: JSON.stringify(data),
                });
                //mostrar descripcion
                document.getElementById("Descripcion").style.display = "block";
                //pintar descripcion
                document.getElementById("text_descripcion").innerHTML = descripcion;
            }
        }
    } catch (error) {
        console.error("Error:", error);
        notyf.error(error.message);
    } finally {
        loading2.style.display = "none";
    }
}

//funcion para traer conductas de la competencia por metodo get y pintarlas
async function mostrarConductas() {
    loading2.style.display = "flex";
    let data = {
        id: id_competencia
            ? id_competencia
            : document.getElementById("Select-competencia").value,
    };
    try {
        const response = await fetch("/conducta/" + data.id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
                "X-Requested-With": "XMLHttpRequest",
            },
        });

        const res = await response.json();
        if (res.success === true && res.data.length > 0) {
            //mostrar conductas
            document.getElementById("titulo_conductas").style.display = "block";
        } else if (res.success === true) {
            //preguntar a chatGPT
            asignarValores();
            let pregunta = {
                pregunta:
                    "Para la competencia de: " +
                    texto_competencia +
                    " perteneciente al perfil de: " +
                    texto_perfil +
                    " y a la actividad de: " +
                    texto_actividad +
                    " y al sector de: " +
                    texto_sector +
                    " y a la familia de: " +
                    texto_familia +
                    " Redacta 4 conductas observables que demuestren la competencia técnica en presente indicativo, quiro la conducta y los indicadores para ser nivel experto, avanzado, inermedio, basico" +
                    " No uses caracteres especiales ni abreviaturas y dame la respuesta en forato JSON con los campos conducta, indicadores_avanzado, indicadores_experto, indicadores_intermedio, indicadores_basico.",
            };
            var conductas = await preguntarChatGPT(pregunta);
            //mostrar conductas
            document.getElementById("titulo_conductas").style.display = "block";
            //pintar conductas
           await pintarConductas(conductas);
        //    await guardarConductas(conductas);
        }
        
    } catch (error) {
        console.error("Error:", error);
        notyf.error(error.message);
    } finally {
        loading2.style.display = "none";
    }
}

async function pintarConductas(conductas) {
    const conductasDiv = document.getElementById("conductas");
    conductasDiv.innerHTML = "";
    const obj = JSON.parse(conductas);

    const niveles = [
        { nombre: "Nivel Experto", clave: "indicadores_experto" },
        { nombre: "Nivel Avanzado", clave: "indicadores_avanzado" },
        { nombre: "Nivel Intermedio", clave: "indicadores_intermedio" },
        { nombre: "Nivel Básico", clave: "indicadores_basico" }
    ];

    const fragment = document.createDocumentFragment();

    obj.forEach((conducta) => {
        const table = document.createElement("table");

        const thead = document.createElement("thead");
        const trHead = document.createElement("tr");
        const th = document.createElement("th");
        th.setAttribute("colspan", "2");
        th.textContent = conducta.conducta;
        trHead.appendChild(th);
        thead.appendChild(trHead);

        const tbody = document.createElement("tbody");

        niveles.forEach(nivel => {
            const tr = document.createElement("tr");
            const tdNivel = document.createElement("td");
            tdNivel.textContent = nivel.nombre;
            const tdIndicador = document.createElement("td");
            tdIndicador.textContent = conducta[nivel.clave];
            tr.appendChild(tdNivel);
            tr.appendChild(tdIndicador);
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        fragment.appendChild(table);
        fragment.appendChild(document.createElement("br"));
    });

    conductasDiv.appendChild(fragment);
}

async function guardarConductas(conductas) {
    let data = {
        id: id_competencia
            ? id_competencia
            : document.getElementById("Select-competencia").value,
        conductas: conductas,
    };
    try {
        const response = await fetch("/guardar-conductas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
                "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify(data),
        });

        const res = await response.json();

        if (res.success === true) {
            notyf.success(res.message);
        } else {
            notyf.error(res.message);
        }
    } catch (error) {
        console.error("Error:", error);
        notyf.error(error.message);
    }
}

