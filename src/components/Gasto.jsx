import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import globalStyles from '../styles'
import { formatearCantidad, formatearFecha } from '../helpers';

const diccionarioIconos = {
    ahorro: require('../img/icono_ahorro.png'),
    comida: require('../img/icono_comida.png'),
    casa: require('../img/icono_casa.png'),
    gastos: require('../img/icono_gastos.png'),
    ocio: require('../img/icono_ocio.png'),
    salud: require('../img/icono_salud.png'),
    suscripciones: require('../img/icono_suscripciones.png'),
}

const Gasto = ({gasto,handleModalEditar}) => {
    const {nombre, categoria,cantidad,id,fecha} = gasto;

    return (
        <Pressable
            onPress={() => handleModalEditar(gasto)}
        >
            <View style={styles.contenedor}>
                <View style={styles.contendio}>
                    <View style={styles.contenedorImg}>
                        <Image 
                            style={styles.img}
                            source={diccionarioIconos[categoria]}
                        />
                        <View style={styles.contenedorTexto}>
                            <Text style={styles.categoria}>{categoria}</Text>
                            <Text style={styles.nombre}>{nombre}</Text>
                            <Text style={styles.fecha}>{formatearFecha(fecha)}</Text>
                        </View>
                    </View>
                    <Text style={styles.cantidad}>{formatearCantidad(cantidad)}</Text>
                </View>
            </View>
        </Pressable>
    )
}

export default Gasto

const styles = StyleSheet.create({
    contenedor: {
        ...globalStyles.contenedor,
        transform: [{translateY: 0}],
        marginBottom: 20
    },
    contendio:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    contenedorImg:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    img:{
        width: 80,
        height: 80
    },
    contenedorTexto:{
        flex: 1
    },
    categoria:{
        color: '#94a3b8',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        textTransform: 'uppercase'
    },
    nombre:{
        fontSize: 22,
        color: '#64748b',
        marginBottom: 5
    },
    fecha: {
        fontSize: 16,
        color: '#db2777',
        fontWeight: '800'
    },
    cantidad:{
        fontSize: 20,
        fontWeight: '800'
    }
})