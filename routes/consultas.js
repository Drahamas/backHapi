const { pool } = require('../config/dataBase');

module.exports = {
    name: "consultas",
    version: "1.0.0",
    register: async (server) => {
        server.route([
            {
                method: "GET",
                path: "/api/consulta",
                handler: (request, h) => {
                    return 'Estas en la sección de Consultas!'
                }
            },
            {
                method: "GET",                                              // Constultar modelos (Mayor y menor)
                path: "/api/consulta/modelos",
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    try {
                        const result = await cliente.query(`SELECT MIN(modelo) AS "Menor_Modelo", MAX(modelo) AS "Mayor_Modelo" FROM vehiculos;`);
                        return result.rows
                    } catch (err) {
                        console.log({ err })
                        return h.code(510).response({ error: 'No se pudieron consultar los modelos' })
                    } finally {
                        cliente.release(true)
                    }
                }
            },
            {
                method: "GET",                                      // Vehículos según el rango de fecha del seguro
                path: "/api/consulta/entre-fechas-seguro/{fecha1}/{fecha2}",
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    const { fecha1, fecha2 } = request.params
                    try {
                        const result = await cliente.query(`SELECT * FROM vehiculos WHERE venc_seguro BETWEEN '${fecha1}' AND '${fecha2}' ORDER BY venc_seguro;`);
                        return result.rows
                    } catch (err) {
                        console.log({ err })
                        return h.code(510).response({ error: 'No se pudieron el consultar los vehículos segun el rango del vencimiento del seguro' })
                    } finally {
                        cliente.release(true)
                    }
                }
            },
            {
                method: "GET",                                      // vehículos según el rango de modelo
                path: "/api/consulta/entre-modelos/{fecha1}/{fecha2}",
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    const { fecha1, fecha2 } = request.params
                    try {
                        const result = await cliente.query(`SELECT * FROM vehiculos WHERE modelo BETWEEN ${fecha1} AND ${fecha2} ORDER BY modelo;`);
                        return result.rows
                    } catch (err) {
                        console.log({ err })
                        return h.code(510).response({ error: 'No se pudieron consultar vehículos segun la fecha de los modelos' })
                    } finally {
                        cliente.release(true)
                    }
                }
            },
            {
                method: "GET",                      // Consulta de la placa, modelo descripción de la línea y descripción del modelo (línea este activa)
                path: "/api/consulta/pla-mod-desl-desm",
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    const { fecha1, fecha2 } = request.params
                    try {
                        const result = await cliente.query(`
                        SELECT placa, modelo, L.descripcion AS "desLinea", M.descripcion AS "desMarca" FROM vehiculos V
                            JOIN lineas L ON V.id_linea = L.id
                            JOIN marcas M ON L.id = M.id
                            WHERE L.linea_activa = 'Si' ORDER BY placa;
                        `);
                        return result.rows
                    } catch (err) {
                        console.log({ err })
                        return h.code(510).response({ error: 'No se realizar la consulta que solicita' })
                    } finally {
                        cliente.release(true)
                    }
                }
            },
            {
                method: "GET",                                      // Suma de los modelos
                path: "/api/consulta/suma-modelo",
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    try {
                        const result = await cliente.query(`SELECT SUM(modelo) AS "sumModelo" FROM vehiculos;`);
                        return result.rows
                    } catch (err) {
                        console.log({ err })
                        return h.code(510).response({ error: 'No se pudo consultar la sumatoria de los modelos' })
                    } finally {
                        cliente.release(true)
                    }
                }
            },
            {
                method: "GET",                                      // Promedio de los modelos
                path: "/api/consulta/prom-modelo",
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    try {
                        const result = await cliente.query(`SELECT AVG(modelo) AS "promModelo" FROM vehiculos;`);
                        return result.rows
                    } catch (err) {
                        console.log({ err })
                        return h.code(510).response({ error: 'No se pudo consultar el promedio de los modelos' })
                    } finally {
                        cliente.release(true)
                    }
                }
            },
            {
                method: "GET",                                      // Lineas activas e inactivas
                path: "/api/consulta/linea-activa-inactiva",
                handler: async(request, h) => {
                    let cliente = await pool.connect();
                    try {
                        const result = await cliente.query(`SELECT COUNT(linea_activa), linea_activa FROM lineas GROUP BY linea_activa;`);
                        return result.rows
                    } catch (err) {
                        console.log({ err })
                        return h.code(510).response({ error: 'No se pudo consultar el promedio de los modelos' })
                    } finally {
                        cliente.release(true)
                    }
                }
            },
        ]);
    }
}