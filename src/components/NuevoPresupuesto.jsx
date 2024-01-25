import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import globalStyles from '../styles';

const NuevoPresupuesto = ({handleNuevoPresupuesto,nuevoIngreso,handleCancelar,presupuestoEdit,handleEditarIngreso,handleEliminarIngreso}) => {
    const [presupuesto,setPresupuesto] = useState({
        presupuesto: 0,
        nombre: ''
    });

    const handleChange= (dato)=>{
        setPresupuesto({
            ...presupuesto,
            [dato.tipo] : dato.valor
        });
    }

    useEffect(() =>{
        if(presupuestoEdit?.id){
            setPresupuesto(presupuestoEdit);
        }
    },[presupuestoEdit]);
    return (
        <View style={styles.contenedor}>
            <View style={styles.campo}>
                <Text style={styles.label}>{presupuestoEdit?.id ? "Editar Ingreso" : nuevoIngreso ? "Nuevo Ingreso" : "Definir Presupuesto Inicial"}</Text>
                <TextInput 
                    style={styles.input}
                    keyboardType='numeric'
                    placeholder='Agrega tu presupuesto: Ej. 500'
                    id='presupuesto'
                    onChangeText={(text) => handleChange({tipo: "presupuesto",valor: +text})}
                    value={presupuesto.presupuesto.toString()}
                />
            </View>

            <View style={styles.campo}>
                <Text style={styles.label}>Nombre del Presupuesto</Text>
                <TextInput 
                    style={styles.input}
                    placeholder='Agrega un nombre al presupuesto: Ej. Pago 1'
                    id='nombre'
                    onChangeText={(text) => handleChange({tipo: "nombre",valor: text})}
                    value={presupuesto.nombre}
                />
            </View>

            <Pressable style={styles.btn}
                onPress={() => {
                    if(!presupuestoEdit?.id){
                        handleNuevoPresupuesto(presupuesto);
                    }
                    else{
                        handleEditarIngreso(presupuesto);
                    }
                    
                }}
            >
                <Text style={styles.btnTexto}>{presupuestoEdit?.id ? "Guardar Cambios" : "Agregar Presupuesto"}</Text>
            </Pressable>
            {presupuestoEdit?.id && (
                <Pressable style={[styles.btn,styles.btnEliminar]}
                    onPress={() => {
                        handleEliminarIngreso(presupuestoEdit?.id);
                    }}
                >
                    <Text style={styles.btnTexto}>Eliminar</Text>
                </Pressable>
            )}

            {nuevoIngreso && (
                <Pressable style={[styles.btn,styles.btnCancelar]}
                    onPress={() => {
                        handleCancelar();
                    }}
                >
                    <Text style={styles.btnTexto}>Cancelar</Text>
                </Pressable>
            )}
        </View>
    )
}

export default NuevoPresupuesto

const styles = StyleSheet.create({
    contenedor: {
        ...globalStyles.contenedor,
        marginBottom: 45
    },
    campo:{
        alignItems: 'stretch',
    },
    label:{
        fontSize: 24,
        color: '#3B9CCF',
        textAlign: 'center'
    },
    input:{
        backgroundColor: '#E3E3E3',
        padding: 10,
        borderRadius: 10,
        textAlign: 'center',
        marginTop: 15,
    },
    btn:{
        marginTop: 20,
        backgroundColor: '#1048A4',
        padding: 10,
        borderRadius: 10
    },
    btnCancelar: {
        backgroundColor: '#FF7D5C'
    },
    btnEliminar:{
        backgroundColor: 'red'
    },
    btnTexto:{
        color: 'white',
        textAlign: 'center',
        textTransform: 'uppercase',
        fontWeight: 'bold'
    }
});