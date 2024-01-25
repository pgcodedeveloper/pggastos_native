import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { formatearCantidad, formatearFecha } from '../helpers';
import globalStyles from '../styles';

const Ingreso = ({ingreso,handleFormEditarIng}) => {
    const {nombre, presupuesto,id,fecha} = ingreso;
    return (
        <Pressable
            onPress={() => handleFormEditarIng(ingreso)}
        >
            <View style={styles.contenedor}>
                <View style={styles.contendio}>
                    <View style={styles.contenedorImg}>
                        <View style={styles.contenedorImgColor}> 
                            <Image 
                                style={styles.img}
                                source={require('../img/moneybag.png')}
                            />
                        </View>
                        <View style={styles.contenedorTexto}>
                            <Text style={styles.categoria}>Ingreso</Text>
                            <Text style={styles.nombre}>{nombre}</Text>
                            <Text style={styles.fecha}>{formatearFecha(fecha)}</Text>
                        </View>
                    </View>
                    <Text style={styles.cantidad}>{formatearCantidad(presupuesto)}</Text>
                </View>
            </View>
        </Pressable>
    )
}

export default Ingreso

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
    contenedorImgColor:{
        width: 80,
        height: 80,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9FE88D',
        padding: 10
    },
    img:{
        width: 50,
        height: 50
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