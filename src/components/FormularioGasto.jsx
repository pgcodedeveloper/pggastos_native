import React, { useEffect, useState } from 'react'
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import globalStyles from '../styles'

const FormularioGasto = ({setModal,handleGasto,gastoEdit,handleEditarGasto,setGastoEdit,handleEliminarGasto}) => {

    const [gasto,setGasto] = useState({
        nombre: '',
        cantidad: 0,
        categoria: ''
    });

    const handleChange = (dato) =>{
        setGasto({
            ...gasto,
            [dato.tipo]: dato.valor
        });
    }

    useEffect(() =>{
        if(gastoEdit?.id){
            setGasto(gastoEdit);
        }
    },[gastoEdit]);

    const eliminarGasto = (id) =>{
        Alert.alert(
            "¿Desea eliminar el gasto?",
            "Esta acción no podra ser recuperada",
            [{text: "No", style: "default"},{text: "Si, eliminar",style: "destructive", onPress: () => {
                handleEliminarGasto(id);
            }}]
        );
    }

    return (
        <View style={styles.contenedor}>
            
            <View>
                <View style={styles.contenedorBotones}>
                    <Pressable style={[styles.btn,styles.btnCancelar]} 
                        onPress={() => {
                            setModal(false);
                            setGastoEdit({});
                        }}
                    >
                        <Image 
                            style={styles.btnImg}
                            source={require('../img/back.png')}
                        />
                        <Text style={styles.btnTexto}>Cancelar</Text>
                    </Pressable>
                    {gastoEdit?.id && (
                        <Pressable style={[styles.btn,styles.btnEliminar]} 
                            onPress={() => {
                                eliminarGasto(gastoEdit?.id)
                            }}
                        >
                            <Text style={styles.btnTexto}>Eliminar</Text>
                            <Image 
                                style={styles.btnImg}
                                source={require('../img/trash.png')}
                            />
                        </Pressable>
                    )}
                </View>
                <Text style={styles.titulo}>{gastoEdit?.id ? "Editar Gasto" : "Nuevo Gasto"}</Text>
            </View>

            <View style={styles.formulario}>
                <View style={styles.campo}>
                    <Text style={styles.label}>Nombre Gasto</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder='Nombre del gasto. Ej. Comida'
                        value={gasto.nombre}
                        id='nombre'
                        onChangeText={(text) => handleChange({tipo: 'nombre', valor: text})}
                    />
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Cantidad</Text>
                    <TextInput 
                        style={styles.input}
                        keyboardType='numeric'
                        placeholder='Cantidad del gasto. Ej. 200'
                        value={gasto.cantidad.toString()}
                        id='cantidad'
                        onChangeText={(text) => handleChange({tipo: 'cantidad', valor: +text})}
                    />
                </View>
                <View style={styles.campo}>
                    <Text style={styles.label}>Categoría Gasto</Text>
                    <Picker
                        style={styles.input}
                        id='categoria'
                        onValueChange={(itemValue) => handleChange({tipo: 'categoria', valor: itemValue})}
                        selectedValue={gasto.categoria}
                    >
                        <Picker.Item label='-- Seleccione --' value={""}/>
                        <Picker.Item label='Ahorro' value={"ahorro"}/>
                        <Picker.Item label='Comida' value={"comida"}/>
                        <Picker.Item label='Casa' value={"casa"}/>
                        <Picker.Item label='Gastos Varios' value={"gastos"}/>
                        <Picker.Item label='Ocio' value={"ocio"}/>
                        <Picker.Item label='Salud' value={"salud"}/>
                        <Picker.Item label='Suscripciones' value={"suscripciones"}/>
                    </Picker>
                </View>

                <Pressable
                    style={styles.btn}
                    onPress={() => {
                        if(!gastoEdit?.id){
                            handleGasto(gasto);
                        }
                        else{
                            handleEditarGasto(gasto);
                        }
                    }}
                >
                    <Text style={styles.btnTexto}>{gastoEdit?.id ? "Guardar Cambios" : "Agregar Gasto"}</Text>
                    <Image 
                        style={styles.btnImg}
                        source={require('../img/nuevo-gasto2.png')}
                    />
                </Pressable>
            </View>
        </View>
    )
}

export default FormularioGasto

const styles = StyleSheet.create({
    contenedor: {
        backgroundColor: '#0284C7',
        flex: 1,
        padding: 15,
    },
    formulario:{
        ...globalStyles.contenedor,
        transform: [{translateY: 0}]
    },
    titulo:{
        textAlign: 'center',
        fontSize: 28,
        marginVertical: 30,
        color: 'white',
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    campo:{
        marginVertical: 10
    },
    label:{
        color: '#64748b',
        textTransform: 'uppercase',
        fontSize: 16,
        fontWeight: '700'
    },
    input: {
        backgroundColor: '#E3E3E3',
        padding: 12,
        borderRadius: 10,
        marginTop: 10
    },
    btn:{
        backgroundColor: '#a2c6ff',
        padding: 15,
        marginTop: 20,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    btnImg:{
        width: 20,
        height: 20
    },
    btnCancelar: {
        backgroundColor: '#9FE88D',
        flex: 1
    }, 
    btnEliminar:{
        flex: 1,
        backgroundColor: 'red'
    },
    btnTexto:{
        textAlign: 'center',
        color: 'black',
        textTransform: 'uppercase',
        fontWeight: '900'
    },
    contenedorBotones:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10
    }
})