// BASES DE DATOS DOCUMENTALES: MongoDB
// Actividad Guiada

// 1. DESCRIPCIÓN DEL CASO

// Una pequeña empresa de emprendedores ha concebido una aplicación para dispositivos móviles que permita la compra-venta de cualquier tipo de artículo entre particulares. 
// Para que un usuario pueda hacer uso de la aplicación debe registrase con un nombre de usuario y una contraseña y aportar una dirección de correo electrónico y la dirección de un punto de venta preferente donde entregar los artículos. 
// Para poner un ítem a la venta el vendedor debe indicar una breve descripción del artículo, el precio de salida y la lista de etiquetas que lo describen. La aplicación incluirá también la fecha en la que el artículo sale a la venta. 
// A fin de que los usuarios de la aplicación puedan buscar artículos que se vendan cerca de su zona, la aplicación también guarda la longitud y latitud del punto de venta introducido por el vendedor del objeto. La dirección definitiva de entrega puede variar, ya que comprador y vendedor se pueden poner de acuerdo mediante correo electrónico para acordar el lugar que mejor les venga a ambos.
// Los compradores interesados en un determinado artículo pueden hacer contraofertas, indicando su precio. La aplicación debe también guardar de cada contraoferta cuándo se realizó y quién la realizó.   
// A efectos de visualización de resultados de las búsquedas, es importante reflejar el estado de un artículo: disponible, vendido o descatalogado. Pasan a este último estado aquellos artículos que hayan sido puestos a la venta hace más de 12 meses y no hayan sido vendidos).

// Crea uns base de datos usando mongodb respecto al ejercicio

item1 = {
    descripcion: "Mando xBox negro",
    fecha: new Date("2015, 3, 21"),
    precio: 10,
    tags: ["consolas", "xbox", "entretenimiento"],
    vendedor: { email: "pperez@gmail.com", psw: "pperez" },
    localizacion: { longitude: 37.743671, latitude: -2.552276 },
    estado: "disponible",
    contraofertas: [
        { email: "llopez@gmail.com", psw: "llopez", oferta: 8, fecha: new Date("2015, 4, 2") },
        { email: "ggomez@gmail.com", psw: "ggomez", oferta: 7, fecha: new Date("2015, 4, 13") }
    ]
}
db.items.insert(item1)

db.items.insert({
    descripcion: "Mando Wii Mario",
    fecha: new Date("2013, 10, 2"),
    precio: 8,
    tags: ["consolas", "wii", "entretenimiento"],
    vendedor: { email: "ffernandez@gmail.com", psw: "ffernandez" },
    localizacion: { longitude: 38.743671, latitude: -10.552276 },
    estado: "vendido",
    comprador: { email: "llopez@gmail.com", psw: "llopez" },
    contraofertas: [
        { email: "llopez@gmail.com", psw: "llopez", oferta: 7, fecha: new Date("2013, 10, 20") },
        { email: "aalonso@gmail.com", psw: "ggomez", oferta: 5, fecha: new Date("2013, 10, 19") }
    ]
})


usr1 = { nombre: "Luis López", email: "llopez@gmail.com", psw: "llopez", direccion: { via: "C/Pez", num: 3, ciudad: "Madrid", cp: "28031" } },
    usr2 = { nombre: "Francisco Fernandez", email: "ffernandez@gmail.com", psw: "ffernandez", direccion: { via: "C/Luna Nueva", num: 145, ciudad: "Barcelona", cp: "08009" } },
    usr3 = { nombre: "Gema Gomez", email: "ggomez@gmail.com", psw: "ggomez", direccion: { via: "C/Sansa", num: 28, ciudad: "Valencia", cp: "46015" } },
    usr4 = { nombre: "Pepe Perez", email: "pperez@gmail.com", psw: "pperez", direccion: { via: "C/Sansa", num: 79, ciudad: "Valencia", cp: "46015" } },
    usr5 = { nombre: "Ana Alonso", email: "aalonso@gmail.com", psw: "aalonso", direccion: { via: "C/Luna Llena", num: 32, ciudad: "Barcelona", cp: "08009" } }

db.items.find()

db.items.find({ descripcion: "Thermomix" }, { _id: 0, precio: 1 })

db.items.find(
    { tags: "consolas" },
    { _id: 0, descripcion: 1 }
)

db.items.find(
    { tags: "consolas", tags: "wii" },
    { _id: 0, descripcion: 1, precio: 1 }
)

var start = new Date(2014, 1, 1);

db.items.find(
    {
        tags: "consolas",
        "contraofertas.fecha": { $gte: start }
    },
    { descripcion: 1 })

db.items.find().sort({ "contraofertas.fecha": -1 })

db.usuarios.find().sort({ "direccion.ciudad": 1 })

db.items.distinct("vendedor.email")

db.usuarios.count({ "direccion.ciudad": "Valencia" })

db.items.aggregate([
    {
        $group: {
            _id: "$vendedor.email",
            articulos: { $push: "$descripcion" }
        }
    }])

db.items.ensureIndex({ "descripcion": 1 })
db.items.ensureIndex({ "vendedor.email": 1 })
db.items.ensureIndex({ "vendedor": 1 })
db.items.ensureIndex({ "descripcion": 1, "estado": 1 })
db.items.ensureIndex({ "localizacion": "2dsphere" })

db.items.find(
    {
        "localizacion":
        {
            $near:
            {
                $geometry:
                {
                    type: "Point",
                    coordinates: [37.743670, -2.552276]
                },
                $maxDistance: 1000
            }
        }
    }
)

// 1. Actualizar la colección “ítems” para hacer una contraoferta al primer producto disponible que esté etiquetado como “teléfono móvil” y que haya sido puesto en venta con posterioridad al 1/1/2014.

db.items.insert({
    descripcion: "Samsung Galaxy S24",
    fecha: new Date("2015, 5, 20"),
    precio: 450,
    tags: ["teléfono móvil", "samsung"],
    vendedor: {
        email: "pperez@gmail.com",
        psw: "pperez"
    },
    localizacion: { longitude: 37.743671, latitude: -2.552276 },
    estado: "disponible",
    contraofertas: [
        { email: "aalonso@gmail.com", psw: "aalonso", oferta: 400, fecha: new Date("2016, 4, 2") }
    ]
})

db.items.update(
    {
        tags: "teléfono móvil",
        fecha: { $gt: new Date("2014, 1, 1") }
    },
    {
        $push: {
            contraofertas: {
                email: "llopez@gmail.com",
                psw: "llopez",
                oferta: 425,
                fecha: new Date()
            }
        }
    }
)

// 2. Actualizar la colección “ítems” para modificar el estado de todos los productos puestos en venta antes de 1/1/2012 y cuyo estado sea disponible. El nuevo estado pasará a ser descatalogado.

db.items.insert({
    descripcion: "Nokia 3310",
    fecha: new Date("2011, 5, 20"),
    precio: 20,
    tags: ["teléfono móvil", "nokia"],
    vendedor: {
        email: "ffernandez@gmail.com",
        psw: "ffernandez"
    },
    localizacion: { longitude: 38.743671, latitude: -10.552276 },
    estado: "disponible",
    contraofertas: [
        {
            email: "ggomez@gmail.com",
            psw: "ggomez",
            oferta: 15,
            fecha: new Date("2011, 6, 2")
        }
    ]
})

db.items.update(
    {
        fecha: { $lt: new Date("2012, 1, 1") },
        estado: "disponible"
    },
    {
        $set: { estado: "descatalogado" }
    },
    { multi: true }
)

db.items.find(
    {
        estado: "disponible"
    },
    {
        _id: 0,
        descripcion: 1,
        fecha: 1,
        estado: 1
    }
)
// 3. Recuperar la descripción y precio de todos los productos etiquetados como “entretenimiento”, cuyo estado sea disponible y que estén en venta en un punto cercano al nuestro (+- 1000 mts.)

db.items.insert({
    descripcion: "Steam Deck",
    fecha: new Date("2010, 5, 20"),
    precio: 200,
    tags: ["consola", "steam", "entretenimiento"],
    vendedor: {
        email: "ffernandez@gmail.com",
        psw: "ffernandez"
    },
    localizacion: { longitude: 38.743671, latitude: -10.552276 },
    estado: "disponible",
    contraofertas: [
        {
            email: "ggomez@gmail.com",
            psw: "ggomez",
            oferta: 15,
            fecha: new Date("2011, 6, 2")
        }
    ]
})

db.items.find(
    {
        tags: "entretenimiento",
        estado: "disponible",
        localizacion: {
            $near: {
                $geometry:
                {
                    type: "Point",
                    coordinates: [38.743671, -10.552276]
                },
                $maxDistance: 1000
            }
        }
    },
    {
        _id: 0,
        descripcion: 1,
        precio: 1
    }
)

// 4. Averiguar el número de ítems disponibles que estén etiquetados como “teléfono móvil” y que cuesten menos de 60€.

db.items.insert({
    descripcion: "Samsung Galaxy A20",
    fecha: new Date("2022, 1, 15"),
    precio: 50,
    tags: ["teléfono móvil"],
    vendedor: {
        email: "pperez@gmail.com",
        psw: "pperez"
    },
    localizacion: { longitude: 37.743671, latitude: -2.552276 },
    estado: "disponible",
    contraofertas: [
        {
            email: "ggomez@gmail.com",
            psw: "ggomez",
            oferta: 45,
            fecha: new Date("2012, 6, 2")
        }
    ]
})

db.items.count({
    tags: "teléfono móvil",
    estado: "disponible",
    precio: { $lt: 60 }
})

// 5. Eliminar los registros cuyo estado sea “vendido” y que hubieran sido puestos a la venta antes del 1/1/2012.



db.items.deleteMany({
    estado: "vendido",
    fecha: { $lt: new Date("2012, 1, 1") }
});

db.items.find(
    {
        estado: "vendido",
        fecha: { $lt: new Date("2012, 1, 1") }
    }
)

db.items.update(
    {
        estado: "vendido",
        descripcion: "Mando Wii Mario",
    },
    {
        $set: {fecha: new Date("2011, 1, 1")}
    }
)