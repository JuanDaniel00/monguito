// PROBLEMÁTICA 3
// Un instituto europeo de gestión de investigación quiere recoger la producción mundial de tesis doctorales. Las tesis doctorales son realizadas por un único autor y dirigidas por 1 o varios directores. Las tesis doctorales, además de un título, tienen asociadas una lista de palabras clave que la contextualizan y una clasificación UNESCO. Dicha clasificación incluye un código de 6 dígitos para representar el área de conocimiento al que pertenecen y una etiqueta que describe dicha área de conocimiento. El doctorando defiende su tesis en una institución, que puede o no ser la misma a la que pertenecen sus directores.
// La aplicación que el instituto pretende desarrollar será usada fundamentalmente por el staff del instituto. Las consultas que está previsto que realice el staff están dirigidas fundamentalmente a la realización de estadísticas con los datos recuperados sobre las tesis leídas y estas estadísticas se realizan siempre sobre periodos de tiempo (por ejemplo, nº de tesis leídas entre dos fechas, el área de conocimiento más estudiada durante un determinado periodo entre dos fechas, la institución en la que más tesis se han leído en un periodo específico, etc.). También se prevé que se puedan hacer consultas por autor de la tesis, a fin de poder profundizar en su obra, y obtener datos como los directores de la tesis, la institución en que la defendió o el título de la misma.
// El dominio descrito queda resumido en el siguiente diagrama de clases UML
// Se solicita que haga un diseño de la base de datos en MongoDB, crea, inserta datos a las colecciones necesarias y que realice las siguientes consultas/operaciones:
// - Recuperar las palabras clave de las tesis leídas los últimos 5 años.
// - Recuperar el número de tesis leídas en el área UNESCO 1203.04 (Inteligencia artificial).
// - Actualizar la afiliación de los investigadores que pertenecen a la Universidad de Palencia por Universidad de Valladolid.
// - Recuperar la institución en la que más tesis se han leído en el último año.
// - Cambiar la afiliación de “Ana Solís” a la Universidad de Complutense.
// - Averiguar cuantos investigadores tiene la Universidad de Alcalá.
// Además, se debe razonar cómo se llevaría a cabo la distribución de los datos para permitir realizar las consultas descritas de la manera más eficiente posible.
// El desarrollo de la solución de la evidencia puede ser entregada mediante las siguientes opciones:
// •	Presentación con herramientas digitales que muestren imágenes (pantallazos) del proceso de cada uno de los puntos solicitados en la actividad
// •	Elaboración de un video, explicando cada uno de los puntos solicitados en la actividad. El video será incluido en la plataforma de www.youtube.com y se insertará la URL de su ubicación  
// En cualquiera de las dos posibilidades la evidencia contara con la siguiente presentación:
// •	Título
// •	Nombres y Apellidos Completos
// •	Nombre del programa

//  Crea una base de datos usando mongodb respecto al ejercicio

// 1. Crear las colecciones

db.createCollection("tesis")

db.createCollection("autores")

db.createCollection("directores")

db.createCollection("instituciones")

// 2. Insertar datos en las colecciones

db.tesis.insert({
    titulo: "Tesis 1",
    palabrasClave: ["palabra1", "palabra2", "palabra3"],
    clasificacion: { codigo: 1203.04, etiqueta: "Inteligencia artificial" },
    fechaDefensa: new Date("2015, 3, 21"),
    institucion: "Universidad de Palencia",
    directores: ["director1", "director2"]
})

db.tesis.insert({
    titulo: "Tesis 2",
    palabrasClave: ["palabra4", "palabra5", "palabra6"],
    clasificacion: { codigo: 1203.04, etiqueta: "Inteligencia artificial" },
    fechaDefensa: new Date("2015, 3, 21"),
    institucion: "Universidad de Palencia",
    directores: ["director1", "director2"]
})


db.autores.insert({
    nombre: "Autor 1",
    tesis: ["Tesis 1"]
})

db.autores.update(
    {
        nombre: "Autor 1"
    },
    {
        $set:
        {
            nombre: "Ana Solis"
        }
    }
)
db.autores.insert({
    nombre: "Autor 2",
    tesis: ["Tesis 2"]
})

db.directores.insert({
    nombre: "Director 1",
    tesis: ["Tesis 1", "Tesis 2"]
})
db.directores.insert({
    nombre: "Director 2",
    tesis: ["Tesis 1", "Tesis 2"]
})
db.instituciones.insert({
    nombre: "Universidad de Palencia",
    tesis: ["Tesis 1", "Tesis 2"]
})

// 3. Realizar las consultas

// Recuperar las palabras clave de las tesis leídas los últimos 5 años.

db.tesis.find(
    {
        fechaDefensa: { $gt: new Date("2014, 3, 21") }
    },
    {
        _id: 0,
        palabrasClave: 1
    }
)

// Recuperar el número de tesis leídas en el área UNESCO 1203.04 (Inteligencia artificial).

db.tesis.find(
    {
        "clasificacion.codigo": 1203.04
    }
).count()

// Actualizar la afiliación de los investigadores que pertenecen a la Universidad de Palencia por Universidad de Valladolid.

db.autores.updateMany(
    {
        tesis: { $in: ["Tesis 1", "Tesis 2"] }
    },
    {
        $set: { afiliacion: "Universidad de Valladolid" }
    },
    { multi: true }
)

// Recuperar la institución en la que más tesis se han leído en el último año.

db.instituciones.aggregate(
    [
        {
            $lookup: {
                from: "tesis",
                localField: "tesis",
                foreignField: "titulo",
                as: "tesis"
            }
        },
        {
            $project: {
                nombre: 1,
                tesisLeidas: { $size: "$tesis" }
            }
        },
        {
            $sort: { tesisLeidas: -1 }
        },
        {
            $limit: 1
        }
    ]
)

// Cambiar la afiliación de “Ana Solís” a la Universidad de Complutense.

db.autores.update(
    {
        nombre: "Ana Solís"
    },
    {
        $set: { afiliacion: "Universidad de Complutense" }
    }
)

// Averiguar cuantos investigadores tiene la Universidad de Alcalá.

db.autores.find(
    {
        afiliacion: "Universidad de Alcalá"
    }
).count()

// Distribución de los datos

// - Crear un índice en la colección de tesis por el campo "fechaDefensa" para poder realizar búsquedas por fecha de defensa de manera eficiente.

db.tesis.createIndex({ fechaDefensa: 1 })

// - Crear un índice en la colección de tesis por el campo "clasificacion.codigo" para poder realizar búsquedas por código de clasificación de manera eficiente.

db.tesis.createIndex({ "clasificacion.codigo": 1 })

// - Crear un índice en la colección de autores por el campo "afiliacion" para poder realizar búsquedas por afiliación de manera eficiente.

db.autores.createIndex({ afiliacion: 1 })

// - Crear un índice en la colección de instituciones por el campo "tesis" para poder realizar búsquedas por tesis de manera eficiente.

db.instituciones.createIndex({ tesis: 1 })
