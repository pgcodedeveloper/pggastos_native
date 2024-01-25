import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { foratearMes, formatearAno } from '../helpers'
const Header = () => {
    return (
        <View>
            <Text style={styles.texto}>Planificador de Gastos</Text>
            <Text style={styles.texto2}>Mes de {foratearMes(Date.now())}</Text>
        </View>
    )
}

export default Header


const styles = StyleSheet.create({
    texto:{
        textAlign: 'center',
        fontSize: 30,
        color: 'white',
        textTransform: 'uppercase',
        fontWeight: '900',
        paddingTop: 15
    },
    texto2:{
        textAlign: 'center',
        fontSize: 25,
        color: '#E3E3E3',
        textTransform: 'uppercase',
        fontWeight: '700',
    }
})