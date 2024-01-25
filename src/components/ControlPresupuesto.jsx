import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import globalStyles from '../styles'
import { formatearCantidad } from '../helpers'
import CircularProgress from 'react-native-circular-progress-indicator'


const ControlPresupuesto = ({presupuesto,gastos,reiniciarApp}) => {
    const [disponible,setDisponible] = useState(0);
    const [gastado,setGastado] = useState(0);
    const [porcentaje,setPorcentaje] = useState(0);

    useEffect(() =>{

        const totalGastado = gastos.reduce((total,gasto) => Number(gasto?.cantidad) + total, 0);

        const totalDisponible = presupuesto - totalGastado;
        const nuevoPor = ((presupuesto - totalDisponible) / presupuesto) * 100;
        if(nuevoPor > 100){
            setPorcentaje(100);
        }
        else{
            setPorcentaje(nuevoPor);
        }
        
        setDisponible(totalDisponible);
        setGastado(totalGastado);
        
    },[presupuesto,gastos]);

    return (
        <View style={styles.contenedor}>
            <View style={styles.centarGrafica}>
                <CircularProgress 
                    value={porcentaje}
                    maxValue={100}
                    duration={1000}
                    radius={150}
                    valueSuffix='%'
                    title='Gastado'
                    inActiveStrokeColor='#f5f5f5'
                    inActiveStrokeWidth={15}
                    activeStrokeColor='#3b82f6'
                    activeStrokeWidth={15}
                    titleStyle={{ fontWeight: 'bold', fontSize: 20}}
                    titleColor='#64748b'
                />
            </View>

            <Pressable
                style={styles.btnReset}
                onPress={() =>{
                    reiniciarApp();
                }}
            >
                <Text style={styles.btnTexto}>Reiniciar App</Text>
            </Pressable>
            <View style={styles.contenedorTexto}>
                <Text style={styles.valor}>
                    <Text style={styles.label}>Presupuesto: </Text>
                    {formatearCantidad(presupuesto)}
                </Text>
                <Text style={[styles.valor,disponible < 0 && styles.labelError]}>
                    <Text style={styles.label}>Disponible: </Text> 
                    {formatearCantidad(disponible)}
                </Text>
                <Text style={styles.valor}>
                    <Text style={styles.label}>Gastado: </Text> 
                    {formatearCantidad(gastado)}
                </Text>
            </View>
        </View>
    )
}

export default ControlPresupuesto

const styles = StyleSheet.create({
    contenedor: {
        ...globalStyles.contenedor

    },
    centarGrafica: {
        alignItems: 'center'
    },
    img: {
        width: 250,
        height: 250
    },
    contenedorTexto:{
        marginTop: 15,
    },
    valor:{
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 10
    },
    label:{
        fontWeight: '800',
        color: '#3b82f6'
    },
    labelError: {
        color: '#CD4945',
        fontWeight: '700'
    },
    btnReset:{
        marginTop: 15,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#DC503F'
    },
    btnTexto:{
        fontSize: 15,
        fontWeight: '900',
        textAlign: 'center',
        color: 'white',
        textTransform: 'uppercase'
    }
});