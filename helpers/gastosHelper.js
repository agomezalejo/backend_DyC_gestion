const Gastos = require("../models").Gasto;
const GastoUsuario = require("../models").GastoUsuario;
const Categorias = require("../models").Categoria;
const GastoFijo = require("../models").GastoFijo;
const GastoTag = require("../models").GastoTag;
const moment = require('moment');



const calcular_liquidacion = (usuarios, monto) => {
    const pagado = usuarios.reduce((total, usuario) => total + usuario.monto_pagado, 0);

    if (pagado > monto) {
        return {ok: false};
    }

    const liquidacion = pagado === monto ? 'PAGADO' : 'PENDIENTE';

    return {ok: true, liquidacion, pagado};
}

const calulos_y_validaciones = (monto, usuarios, fecha, id_categoria, tags) => {
    
    let ok = true;
    
    let resp = calcular_liquidacion(usuarios, monto);
    if(!resp.ok){
        return {ok: false, mensaje:'El monto pagado no puede ser mayor que el monto total'};
    }
    let {liquidacion, pagado} = resp;

    let fechaMoment = moment(fecha, "DD/MM/YYYY");

    const fechaLimite = moment().clone().subtract(27, 'days');
    if (!fechaMoment.isSameOrAfter(fechaLimite)) {
        return {ok: false, mensaje:'Para crear un gasto fijo, la fecha debe ser igual o mayor que la fecha actual menos 27 días'};
    }

    let fechaDate = fechaMoment.toDate();

    Categorias.findByPk(id_categoria).then((categoria) => {
        if (!categoria) {
            return {ok: false, mensaje:'La categoría no existe'}
        }
    });

    if(pagado > 0){
        usuarios.forEach(usuario => {
            if(usuario.monto_pagado > 0 && !usuario.metodo_pago){
                return {ok: false, mensaje:'El metodo de pago es obligatorio si se ha pagado algo'}
            }else{
                usuario.metodo_pago = usuario.metodo_pago.toUpperCase();
            }
        });
    }

    if(!tags){
        tags = [];
    }

    return {ok, pagado, liquidacion, fechaDate, tagsValidated:tags};
}

const tranformar_frecuencia = (frecuencia) => {
    let frecuencia_transformada = frecuencia.toUpperCase();
    unit_time = null;
    if (frecuencia_transformada === 'SEMANALMENTE') {
        unit_time= 'week';
    } else if (frecuencia_transformada === 'MENSUALMENTE') {
        unit_time= 'month';
    } else if (frecuencia_transformada === 'ANUALMENTE') {
        unit_time= 'year';
    }
    return {unit_time, frecuencia_transformada};
}


const calcular_proximos_fijos = (proxima_fecha, unit_time) => {

    let proximaDate = moment(proxima_fecha).clone();
    let fechasParaCrear = [];
    let proximo_mes = moment().add(1, 'month')

    while (proximaDate.isSameOrBefore(moment(), 'month')) {
        fechasParaCrear.push(proximaDate.clone().toDate());
        proximaDate.add(1, unit_time);
    }
    if (moment().date() > 28 && moment().hour() >= 23) {
        while (proximaDate.isSame(proximo_mes, 'month')) {
            fechasParaCrear.push(proximaDate.clone().toDate());
            proximaDate.add(1, unit_time);
        }
    }

    return fechasParaCrear;
}


const crear_gasto_casual = async (constructor_gasto, tags, usuarios_gastos) => {
    const nuevoGasto = await Gastos.create(constructor_gasto);

    for (const tag of tags) {
        await GastoTag.create({
            id_gasto: nuevoGasto.id,
            id_tag: tag
        })
    }

    for (const usuario of usuarios_gastos) {
        await GastoUsuario.create({
        id_gasto: nuevoGasto.id,
        id_usuario: usuario.id,
        monto_pagado: usuario.monto_pagado,
        metodo_pago: usuario.metodo_pago,
        });
    }

    return nuevoGasto;
}


const crear_gasto_y_fijo = async (constructor_gasto, tags, constructor_fijo, usuarios_gastos) => {
    const nuevoGasto = await Gastos.create(constructor_gasto);

    for (const tag of tags) {
        await GastoTag.create({
            id_gasto: nuevoGasto.id,
            id_tag: tag
        })
    }


    constructor_fijo.id_gasto = nuevoGasto.id;
    constructor_fijo.agendado = false;

    let fijo = await GastoFijo.create(constructor_fijo);

    for (const usuario of usuarios_gastos) {
        await GastoUsuario.create({
        id_gasto: nuevoGasto.id,
        id_usuario: usuario.id,
        monto_pagado: usuario.monto_pagado,
        metodo_pago: usuario.metodo_pago
        });
    }

    return {fijo, nuevoGasto};
}

const crear_proximos_fijos = async (constructor_gasto, tags, fechas_para_crear, constructor_fijo, fijo, unit_time, usuarios_gastos) =>{
    constructor_gasto.liquidacion = "PENDIENTE"
    constructor_gasto.monto_pagado = 0;
    for (const fechaCreacion of fechas_para_crear) {
        let proxima_fecha = moment(fechaCreacion).clone().add(1, unit_time).toDate();
        constructor_gasto.fecha = fechaCreacion;
        constructor_fijo.proxima_fecha = proxima_fecha;

        let resp_ = await crear_gasto_y_fijo(constructor_gasto, tags, constructor_fijo, usuarios_gastos)
        let nuevo_fijo = resp_.fijo;
        if(moment(fijo.proxima_fecha).isSame(fechaCreacion)){
            fijo.agendado = true;
            await fijo.save();
            fijo = nuevo_fijo;
        }
    }
}

module.exports = {
    calulos_y_validaciones,
    crear_gasto_casual,
    crear_gasto_y_fijo,
    crear_proximos_fijos,
    tranformar_frecuencia,
    calcular_proximos_fijos

}