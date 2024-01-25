import React from 'react'
import Ingreso from './Ingreso'
import { StyleSheet, Text, View } from 'react-native'
import Paginar from './Paginar'

const ListadoIngresos = ({ingresos,handleFormEditarIng,currentPage,setCurrentPage,pagTot}) => {
    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>Tus Ingresos</Text>

            {ingresos?.length > 0 && (
                <View style={styles.contenedorLista}>
                    {ingresos?.map(ingreso => (
                        <Ingreso 
                            key={ingreso.id}
                            ingreso={ingreso}
                            handleFormEditarIng={handleFormEditarIng}
                        />
                    ))}

                    <Paginar 
                        pagina={currentPage}
                        setCurrentPage={setCurrentPage}
                        pagTot={pagTot}
                    />
                </View>
            )}
        </View>
    )
}

export default ListadoIngresos

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