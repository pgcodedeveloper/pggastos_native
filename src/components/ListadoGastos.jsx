import React from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import Gasto from './Gasto'
import Paginar from './Paginar'

const ListadoGastos = ({gastos,handleModalEditar,currentPage,setCurrentPage,pagTot}) => {
    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>Tus Gastos</Text>

            {gastos?.length > 0 ? (
                <View style={styles.contenedorLista}>
                    {gastos.map(gasto => (
                        <Gasto 
                            key={gasto.id}
                            gasto={gasto}
                            handleModalEditar={handleModalEditar}
                        />
                    ))}

                    <Paginar 
                        pagina={currentPage}
                        setCurrentPage={setCurrentPage}
                        pagTot={pagTot}
                    />

                </View>
            ): (
                <Text style={styles.noGasto}>Aún no tienes gastos</Text>
            )}
        </View>
    )
}

export default ListadoGastos

const styles = StyleSheet.create({
    contenedor:{
        marginTop: 5,
        padding: 15,
    },
    contenedorLista:{
        marginTop: 20,
        marginBottom: 20
    },
    titulo: {
        fontSize: 30,
        color: '#64748B',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    noGasto:{
        textAlign: "center",
        marginTop: 20,
        fontSize: 20,
        color: '#CA8E1B',
        fontWeight: '600'
    }
});