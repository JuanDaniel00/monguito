// PROBLEMÁTICA 2
// Una empresa que proporciona almacenamiento de fotos en la web necesita un sistema para almacenar todos sus archivos y dentro de sus solicitudes han pedido tener en cuenta los problemas de escalabilidad y rendimiento de las bases de datos relacionales. Por tal razón se implementará una solución por medio de la estructura NoSQL que cumpla las siguientes especificaciones:
// •	Las fotos se caracterizan por su URL (es única); además se almacena el nombre del archivo, tipo, tamaño, resolución y un campo que indica si la fotografía es pública o privada.
// •	Los usuarios pueden añadir todas las etiquetas que necesiten a cada una de sus fotos para clasificarlas. Además del nombre de la etiqueta, se almacena el número total de fotos que la emplean. El sistema también puede sugerir etiquetas adicionales, por lo que se debe indicar quién ha sugerido la etiqueta: el usuario o el sistema. Y eso para cada foto.
// •	Para identificar a los usuarios, se almacena el nombre de usuario, su password y su dirección de correo electrónico.

// 1. Crear una colección llamada “fotos” con los campos especificados.

db.createCollection("fotos")

db.fotos.createIndex({ url: 1 }, { unique: true })

// 2. Crear una colección llamada “usuarios” con los campos especificados.

db.createCollection("usuarios")

db.usuarios.createIndex({ email: 1 }, { unique: true })

// 3. Insertar al menos 3 documentos en la colección “fotos”.

db.fotos.insert({
    url: "https://www.google.com",
    nombre: "foto1",
    tipo: "jpg",
    tamaño: 100,
    resolucion: "1024x768",
    publica: true,
    etiquetas: [
        { nombre: "paisaje", totalFotos: 1, sugeridaPor: "usuario" },
        { nombre: "montaña", totalFotos: 1, sugeridaPor: "sistema" }
    ]
})

db.fotos.insert({
    url: "https://www.github.com",
    nombre: "foto2",
    tipo: "png",
    tamaño: 200,
    resolucion: "800x600",
    publica: false,
    etiquetas: [
        { nombre: "playa", totalFotos: 1, sugeridaPor: "usuario" },
        { nombre: "arena", totalFotos: 1, sugeridaPor: "sistema" }
    ]
})

db.fotos.insert({
    url: "https://www.youtube.com",
    nombre: "foto3",
    tipo: "gif",
    tamaño: 300,
    resolucion: "640x480",
    publica: true,
    etiquetas: [
        { nombre: "ciudad", totalFotos: 1, sugeridaPor: "usuario" },
        { nombre: "edificio", totalFotos: 1, sugeridaPor: "sistema" }
    ]
})

// 4. Insertar al menos 2 documentos en la colección “usuarios”.

db.usuarios.insert({
    nombre: "usuario1",
    email: "usuario1@gmail.com",
    password : "USER1"
})

db.usuarios.insert({
    nombre: "usuario2",
    email: "usuario2@gmail.com",
    password : "USER2"
})
