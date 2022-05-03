const { pool } = require('../config/dataBase');

module.exports = {
    name: "marcas",
    version: "1.0.0",
    register: async (server) => {
        server.route([
            {
                method: "GET",
                path: "/api/marca",
                handler: (request, h) => {
                    return 'Estas en la sección de Marcas!'
                }
            },
            {
                method: "GET",                                  // Peticion de las marcas
                path: "/api/marcas",
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    try {
                        const result = await cliente.query(`SELECT * FROM marcas;`);
                        return result.rows
                        
                    } catch (err) {
                        console.log({ err })
                        return h.code(508).response({ error: 'No se pudieron consultar las marcas de la base de datos' })
                    } finally {
                        cliente.release(true)
                    }
                }
            },
            {
                method: "PATCH",                                 // Editar una Marca
                path: "/api/marcas/{id}",
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

                        await cliente.query(`UPDATE marcas SET ${fieldsQuery.join()} WHERE id = '${id}'`);
                        const marcas = await cliente.query(`SELECT * FROM marcas WHERE id = '${id}';`);
                        
                        return marcas.rows
                        
                    } catch (error) {
                        console.log(error);
                        return h.response({ error: 'No se puede editar la marca' }).code(508);
                    }
                }
            },
            {
                method: "GET",                                  // Peticion de las marcas activas
                path: "/api/marcas/activas",
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    try {
                        const result = await cliente.query(`SELECT * FROM marcas WHERE marca_activa = 'Si';`);
                        return result.rows
                        
                    } catch (err) {
                        console.log({ err })
                        return h.code(508).response({ error: 'No se pudieron consultar las marcas activas' })
                    } finally {
                        cliente.release(true)
                    }
                }
            },
            {
                method: "GET",                                  // Peticion de las marcas inactivas
                path: "/api/marcas/inactivas",
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    try {
                        const result = await cliente.query(`SELECT * FROM marcas WHERE marca_activa = 'No';`);
                        return result.rows
                        
                    } catch (err) {
                        console.log({ err })
                        return h.code(508).response({ error: 'No se pudieron consultar las marcas inactivas' })
                    } finally {
                        cliente.release(true)
                    }
                }
            },
            {
                method: "POST",                                 // Agregar una Marca
                path: "/api/marcas",
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    const { nombre } = request.payload
                    try {
                        await cliente.query(`
                        INSERT INTO marcas (id, nombre, descripcion, marca_activa)
                        VALUES (NEXTVAL ('id_marca_seq'), '${request.payload.nombre}', '${request.payload.descripcion}', '${request.payload.marca_activa}');
                            `)
                        const result = await cliente.query(`SELECT * FROM marcas WHERE nombre = '${ nombre }';`);
                        return result.rows;
                    } catch (error) {
                        console.log(error);
                        return h.response({ error: 'No se pudó agregar una marca' }).code(508);
                    }
                }
            },
        ])
    }
}