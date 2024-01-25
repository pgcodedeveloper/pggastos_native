import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

const Paginar = ({pagina,setCurrentPage,pagTot}) => {
    return (
        <View style={styles.contnenedor}>
            <Pressable style={[styles.btn, pagina === 1 && styles.btnDisabled]} disabled={pagina === 1 ? true : false} onPress={() => setCurrentPage(pagina - 1)}>
                <Text style={styles.texto}>Prev</Text>
            </Pressable>
            <Text style={styles.pagina}>{pagina} de {pagTot}</Text>
            <Pressable style={[styles.btn, pagina === pagTot && styles.btnDisabled]} disabled={pagina === pagTot ? true : false} onPress={() => setCurrentPage(pagina + 1)}>
                <Text style={styles.texto}>Next</Text>
            </Pressable>
        </View>
    )
}

export default Paginar

const styles = StyleSheet.create({
    contnenedor:{
        padding: 15,
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5
    },
    btn:{
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        flex: 1
    },
    btnDisabled:{
        opacity: 0.5,
    },  
    texto:{
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '700'
    },
    pagina:{
        fontSize: 14,
        fontWeight: 'bold'
    }
});