
export const formatearCantidad = (valor) =>{
    return Number(valor).toLocaleString('en-US',{
        style: 'currency',
        currency: 'USD'
    })
}

export const formatearFecha = (fecha) =>{
    const f = new Date(fecha);
    const options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    }
    return f.toLocaleDateString('es-ES',options);
}

export const formatearAno= fecha =>{
    const fechaN= new Date(fecha);
    const opciones={
        year: 'numeric'
    }
    return fechaN.toLocaleDateString('es-ES',opciones);
}

export const foratearMes= fecha =>{
    const fechaN= new Date(fecha);
    const op= {
        year: 'numeric',
        month: 'long'
    }

    return fechaN.toLocaleDateString('es-ES',op);
}

export const generarID = () =>{
    const random = Math.random().toString(36).substring(2,11);
    const f = Date.now().toString(36);
    return random + f;
}