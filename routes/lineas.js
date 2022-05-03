const { pool } = require('../config/dataBase');

module.exports = {
    name: "lineas",
    version: "1.0.0",
    register: async (server) => {
        server.route([
            {
                method: "GET",
                path: "/api/linea",
                handler: (request, h) => {
                    return 'Estas en la sección de Lineas!'
                }
            },
            {
                method: "GET",                                  // Peticion de las marcas
                path: "/api/lineas",
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    try {
                        const result = await cliente.query(`SELECT * FROM lineas;`);
                        return result.rows
                        
                    } catch (err) {
                        console.log({ err })
                        return h.code(508).response({ error: 'No se pudieron consultar las lineas de la base de datos' })
                    } finally {
                        cliente.release(true)
                    }
                }
            },
            {
                method: "PATCH",                                 // Editar una Linea
                path: "/api/lineas/{id}",
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    
                    try {
                        const { id } = request.params

                        const fields = Object.keys(request.payload);
                        const fieldsQuery = fields.map(field => {
                            if(typeof request.payload[`${field}`] === 'string'){
                                return `${field} = '${request.payload[`${field}`]}'`
                            }else{
                                return `${field} = ${request.payload[`${field}`]}`
                            }
                        })

                        await cliente.query(`UPDATE lineas SET ${fieldsQuery.join()} WHERE id = '${id}'`);
                        const lineas = await cliente.query(`SELECT * FROM lineas WHERE id = '${id}';`);
                        
                        return lineas.rows
                        
                    } catch (error) {
                        console.log(error);
                        return h.response({ error: 'No se puede editar la linea' }).code(508);
                    }
                }
            },
            {
                method: "GET",                                  // Peticion de las lineas activas
                path: "/api/lineas/activas",
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    try {
                        const result = await cliente.query(`SELECT * FROM lineas WHERE linea_activa = 'Si';`);
                        return result.rows
                        
                    } catch (err) {
                        console.log({ err })
                        return h.code(508).response({ error: 'No se pudieron consultar las lineas activas' })
                    } finally {
                        cliente.release(true)
                    }
                }
            },
            {
                method: "GET",                                  // Peticion de las lineas inactivas
                path: "/api/lineas/inactivas",
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    try {
                        const result = await cliente.query(`SELECT * FROM lineas WHERE linea_activa = 'No';`);
                        return result.rows
                        
                    } catch (err) {
                        console.log({ err })
                        return h.code(508).response({ error: 'No se pudieron consultar las lineas inactivas' })
                    } finally {
                        cliente.release(true)
                    }
                }
            },
            {
                method: "POST",                                 // Agregar una Marca
                path: "/api/lineas",
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    const { nombre } = request.payload
                    try {
                        await cliente.query(`
                        INSERT INTO lineas (id, nombre, descripcion, linea_activa, id_marca)
                        VALUES (NEXTVAL ('id_linea_seq'), '${request.payload.nombre}', '${request.payload.descripcion}', 
                            '${request.payload.linea_activa}', ${request.payload.id_marca});
                            `)
                        const result = await cliente.query(`SELECT * FROM lineas WHERE nombre = '${ nombre }';`);
                        return result.rows;
                    } catch (error) {
                        console.log(error);
                        return h.response({ error: 'No se pudó agregar una linea' }).code(508);
                    }
                }
            },
        ])
    }
}