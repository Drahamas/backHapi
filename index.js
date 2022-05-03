const Hapi = require('@hapi/hapi');
const path = require('path');
const inert = require('inert');         // Para trabajar con archivos estaticos
const { options } = require('pg/lib/defaults');
const { register } = require('./routes/vehiculos');
require('dotenv').config();


const init = async() =>{

    const server = new Hapi.Server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes:{
            files: {
                relativeTo: path.join(__dirname, 'public')
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Hello World!';
        }
    });

    await server.register([
        require("./routes/vehiculos"),
        require("./routes/marcas"),
        require('./routes/lineas'),
        require("./routes/consultas")
    ]);

    await server.register(inert);           // Para trabajar archivos estaticos
    
    //Inicialización del servidor Hapi
    await server.start();
    console.log(`Server running on: ${server.info.uri}`);


}

init();