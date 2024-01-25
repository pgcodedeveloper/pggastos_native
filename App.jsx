import { StatusBar } from 'expo-status-bar';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from './src/components/Header';
import NuevoPresupuesto from './src/components/NuevoPresupuesto';
import { useEffect, useRef, useState } from 'react';
import ControlPresupuesto from './src/components/ControlPresupuesto';
import FormularioGasto from './src/components/FormularioGasto';
import { foratearMes, formatearCantidad, formatearFecha, generarID } from './src/helpers';
import ListadoGastos from './src/components/ListadoGastos';
import { Picker } from '@react-native-picker/picker';
import globalStyles from './src/styles';
import ListadoIngresos from './src/components/ListadoIngresos';
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing'
import LogoPG from './src/img/LogoPG.png'


export default function App() {
    const scrollViewRef = useRef(null);
    const [isValidPresupuesto,setIsValidPresupuesto] = useState(false);
    const [presupuesto,setPresupuesto] = useState(0);
    const [presupuestos,setPresupuestos] = useState([]);
    const [gastos,setGastos] = useState([]);
    const [modal,setModal] = useState(false);
    const [gastoEdit, setGastoEdit] = useState({});
    const [ingresoEdit, setIngresoEdit] = useState({});
    const [nuevoIngreso,setNuevoIngreso] = useState(false);
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroGasto, setFiltroGasto] = useState('');
    const [gastosFiltro,setGastoFiltro] = useState([]);
    const [presupuestosFiltro,setPresupuestosFiltro] = useState([]);
    const [currentPage,setCurrentPage] = useState(1);
    const CANT_POR_PAGINA = 4;
    let CANT_PAGINAS = Math.ceil(gastos.length / CANT_POR_PAGINA);
    let CANT_PAGINAS_I = Math.ceil(presupuestos.length / CANT_POR_PAGINA);

    useEffect(() =>{
        const obtenerPresupuestosAS = async () =>{
            try {
                const presupuestosSt = await AsyncStorage.getItem('pgGastos_presupuestos') ?? [];
                
                if(presupuestosSt){
                    setPresupuestos(JSON.parse(presupuestosSt));
                    setIsValidPresupuesto(true);
                }
                
            } catch (error) {   
                console.log(error);
            }
        }
        obtenerPresupuestosAS();
    },[]);

    useEffect(() =>{
        const obtenerGastosAS = async () =>{
            try {
                const gastosSt = await AsyncStorage.getItem('pgGastos_gastos');
                setGastos(gastosSt ? JSON.parse(gastosSt) : []);
            } catch (error) {   
                console.log(error);
            }
        }
        obtenerGastosAS();
    },[])

    const handleNuevoPresupuesto = (presupuesto) =>{
        if(Number(presupuesto.presupuesto) > 0){
            if(presupuesto.nombre){
                setIsValidPresupuesto(true);
                presupuesto.id = generarID();
                presupuesto.fecha = Date.now();
                setPresupuestos([
                    ...presupuestos,
                    presupuesto
                ]);
                guardarPresupuestoAS();
            }
            else{
                Alert.alert(
                    'Error',
                    'El nombre del presupuesto es obligatorio'
                );
                setIsValidPresupuesto(false);
            }
        }
        else{
            Alert.alert(
                'Error',
                'El presupuesto no es válido'
            );
            setIsValidPresupuesto(false);
        }
    }

    const guardarPresupuestoAS = async () => {
        try {
            await AsyncStorage.setItem('pgGastos_presupuestos',JSON.stringify(presupuestos));
        } catch (error) {
            console.log(error);
        }
    }

    const handleGasto = (gasto) =>{
        if(!Object.values(gasto).includes("")){
            gasto.id = generarID();
            gasto.fecha = Date.now();
            setGastos([
                ...gastos,
                gasto
            ]);
            setModal(!modal);
        }
        else{
            Alert.alert(
                "Error",
                "Todos los campos son obligatorios"
            );
        }
    }

    const handleModalEditar = (gasto) =>{
        scrollToTop();
        setModal(!modal);
        setGastoEdit(gasto);
    }

    const handleFormEditarIng = (ingreso) =>{
        scrollToTop();
        setIngresoEdit(ingreso);
        setIsValidPresupuesto(false);
        setNuevoIngreso(true);
    }

    const handleEditarIngreso = (ingreso) =>{
        const presupuestosAct = presupuestos.map(i => i.id === ingreso.id ? ingreso : i);
        setPresupuestos(presupuestosAct);
        setIngresoEdit({});
        setIsValidPresupuesto(true);
        setNuevoIngreso(false);
    }

    const handleEditarGasto = (gasto) =>{
        const gastosAct = gastos.map(g => g.id === gasto.id ? gasto : g);
        setGastos(gastosAct);
        setGastoEdit({});
        setModal(false);
    }

    const handleEliminarGasto = (id) =>{
        const gastosAct = gastos.filter(g => g.id !== id);
        setGastos(gastosAct);
        setGastoEdit({});
        setModal(false);
    }

    const handleEliminarIngreso = (id) =>{
        Alert.alert(
            "¿Esta seguro de eliminar el ingreso?",
            "Esta acción no podra ser recuperada",
            [{text: 'No', style: 'default'}, {text: 'Si, eliminar',style: 'cancel',onPress: () =>{
                const ingresosAct = presupuestos.filter(i => i.id !== id);
                setPresupuestos(ingresosAct);
                setIngresoEdit({});
                setIsValidPresupuesto(true);
                setNuevoIngreso(false);
            }}]
        );
    }

    const paginar = (pag,tipo,filtro) =>{
        if(tipo === "gastos"){
            if(pag <= CANT_PAGINAS){
                --pag; //Ajustamos el número de página para que sea compatible con los índices del array
                if(!filtro){
                    const gastosFill = gastos?.slice(pag * CANT_POR_PAGINA,(pag + 1)*CANT_POR_PAGINA);
                    setGastoFiltro(gastosFill);
                }
                else{
                    const gastosF = gastos.filter(g => g.categoria === filtro); 
                    const gastosFill = gastosF?.slice(pag * CANT_POR_PAGINA,(pag + 1)*CANT_POR_PAGINA);
                    setGastoFiltro(gastosFill);
                }
            }
        }
        else{
            if(pag <= CANT_PAGINAS_I){
                --pag; //Ajustamos el número de página para que sea compatible con los índices del array
                const presupuestosFill = presupuestos?.slice(pag * CANT_POR_PAGINA,(pag + 1)*CANT_POR_PAGINA);
                setPresupuestosFiltro(presupuestosFill);
            }
        }
        
    }
    useEffect(() => {
        if(isValidPresupuesto){
            guardarPresupuestoAS();
        }
    },[isValidPresupuesto]);

    useEffect(() =>{
        const guardarGastosAS = async () => {
            try {
                await AsyncStorage.setItem('pgGastos_gastos',JSON.stringify(gastos));
            } catch (error) {
                console.log(error);
            }
        }
        guardarGastosAS();
    },[gastos])


    useEffect(() =>{
        let suma = 0;
        presupuestos.map(presp => {
            suma = suma + presp.presupuesto;
        });
        setPresupuesto(suma);
        if(presupuestos.length > 0){
            CANT_PAGINAS_I = Math.ceil(presupuestos.length / CANT_POR_PAGINA);
            setCurrentPage(1);
            paginar(currentPage,"ingresos");
        }
    },[presupuestos]);

    useEffect(() =>{
        if(gastos.length > 0){
            CANT_PAGINAS = Math.ceil(gastos.length / CANT_POR_PAGINA);
            setCurrentPage(1);
            paginar(currentPage,"gastos","");
        }
    },[gastos]);

    useEffect(() =>{
        if(filtroTipo === "gastos"){
            if(gastos.length > 0){
                paginar(currentPage,"gastos","");
            }
        }
        else{
            if(presupuestos.length > 0){
                paginar(currentPage,"ingresos");
            }
        }
    },[currentPage]);

    useEffect(() =>{
        paginar(currentPage,"gastos",filtroGasto);
    },[filtroGasto]);

    const scrollToTop = () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
        }
    };

    const handleCancelar = () =>{
        setIngresoEdit({});
        setIsValidPresupuesto(true);
        setNuevoIngreso(false);
    }

    const reiniciarApp = () =>{
        Alert.alert(
          "¿Estas seguro que deseas resetear la app?",
          "Esto eliminará presupuesto y gastos",
          [{text: "No", style: "default"},{text: "Si, eliminar",style:"cancel", onPress: async() =>{
            try {
                await AsyncStorage.clear();
                setIsValidPresupuesto(false);
                setPresupuesto(0);
                setPresupuestos([]);
                setPresupuestosFiltro([]);
                setGastos([]);
                setGastoFiltro([]);
                setFiltroGasto('');
                setFiltroTipo('');
                setCurrentPage(1);
            } catch (error) {
                console.log(error);
            }
          }}]
        );
    }
    
    const handlePDF= (gastos,presupuesto) =>{
        if(gastos.length > 0){
            Alert.alert("Atención","¿Desea descargar el reporte del mes?",
            [{text: "No", style:"default"}, {text: "Sí, descargar", style: 'cancel', onPress: () => { 
                const totalGastado= gastos.reduce((total,gasto) => gasto.cantidad + total, 0);
                const totalDisponible = (presupuesto >= totalGastado) ? (presupuesto - totalGastado) : 0;
                const totaldeficit= (totalDisponible === 0) ? (presupuesto - totalGastado) : 0;
                const arrayPresu= [{
                    presupuesto: `${formatearCantidad(presupuesto)}`,
                    disponible: `${formatearCantidad(totalDisponible)}`,
                    gastado: `${formatearCantidad(totalGastado)}`,
                    deficit: `${formatearCantidad(totaldeficit)}`
                }]
                const rows1=[];
                arrayPresu.map(array => rows1.push(Object.values(array)));

                let html1 = `
                    <tr>
                `;
                rows1[0].forEach(r => {
                    html1 += `
                        <td>${r}</td>
                    `
                });
                html1 += ` </tr> `;

                const rows3= [];
                let ingreso = [];
                presupuestos.map(pres =>{
                    const {presupuesto,nombre,fecha} = pres;
                    ingreso = [
                    "INGRESO",
                    nombre.toUpperCase(),
                    formatearCantidad(presupuesto),
                    formatearFecha(fecha)
                    ]
                    return rows3.push(ingreso);
                });
                
                let html2 = ``;
                rows3.map(r => {
                    html2 += `
                        <tr>
                            <td>${r[0]}</td>
                            <td>${r[1]}</td>
                            <td>${r[2]}</td>
                            <td>${r[3]}</td>
                        </tr>
                    `
                });
                

                const rows= [];
                let gasto = [];
                gastos.map(gas =>{
                    const {categoria,nombre,cantidad,fecha} = gas;
                    gasto = [
                    "GASTO",
                    nombre,
                    formatearCantidad(cantidad),
                    categoria.toUpperCase(),
                    formatearFecha(fecha)
                    ]
                    return rows.push(gasto);
                });

                let html3 = ``;
                rows.map(r => {
                    html3 += `
                        <tr>
                            <td>${r[0]}</td>
                            <td>${r[1]}</td>
                            <td>${r[2]}</td>
                            <td>${r[3]}</td>
                            <td>${r[4]}</td>
                        </tr>
                    `;
                });
    
                let totalA = 0,totalC =0,totalCo = 0,totalG = 0,totalO = 0,totalS = 0,totalSc = 0;
                gastos.map(gasto =>{
                    if(gasto.categoria === "ahorro"){
                        totalA = Number(gasto.cantidad) + totalA;
                    }
                    else if(gasto.categoria === "comida"){
                        totalCo = Number(gasto.cantidad) + totalCo;
                    }
                    else if(gasto.categoria === "casa"){
                        totalC = Number(gasto.cantidad) + totalC;
                    }
                    else if(gasto.categoria === "gastos"){
                        totalG = Number(gasto.cantidad) + totalG;
                    }
                    else if(gasto.categoria === "ocio"){
                        totalO = Number(gasto.cantidad) + totalO;
                    }
                    else if(gasto.categoria === "salud"){
                        totalS = Number(gasto.cantidad) + totalS;
                    }
                    else{
                        totalSc = Number(gasto.cantidad) + totalSc;
                    }
                });
                let row4 = [
                    ["AHORRO",formatearCantidad(totalA)],
                    ["COMIDA",formatearCantidad(totalCo)],
                    ["CASA",formatearCantidad(totalC)],
                    ["GASTOS VARIOS",formatearCantidad(totalG)],
                    ["OCIO", formatearCantidad(totalO)],
                    ["SALUD",formatearCantidad(totalS)],
                    ["SUSCRIPCIONES",formatearCantidad(totalSc)],
                ];

                let html4 = ``;
                row4.map(r => {
                    html4 += 
                    `
                        <tr>
                            <td>${r[0]}</td>
                            <td>${r[1]}</td>
                        </tr>
                    `
                });
                
                const html = `
                    <html>
                        <head>
                            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                        </head>
                        <body style="text-align: center;">
                            <main>
                                <div>
                                    <img src="https://res.cloudinary.com/damn8kr5q/image/upload/v1706201218/ax6vdss59y90zhqcxd4i.png" alt="Imagen PG"/>
                                    <div class="cont">
                                        <p style="color: rgb(133,133,133); font-weight: 800; margin-top: 30px; font-size: 25px;">Fecha de emisíon: ${formatearFecha(Date.now())}</p>
                                        <p style="color: rgb(133,133,133); font-weight: 600;">ID del reporte: <span>${generarID()}</span></p>
                                    </div>
                                </div>

                                <h1 style="font-size: 45px; font-weight: 700; color: rgb(2, 132, 199); margin-top: 50px;">
                                    Reporte de gastos del mes de ${foratearMes(Date.now())}
                                </h1>

                                <h2>Presupuesto</h2>
                                <table>
                                    <caption>Datos del mes</caption>
                                    <tr> 
                                        <th>Presupuesto Total</th> 
                                        <th>Saldo a favor</th> 
                                        <th>Total Gastado</th>
                                        <th>Déficit Total</th>
                                    </tr>
                                    ${html1 ?? ""}
                                </table>

                                <h2 style="margin-top: 35px;">Ingresos del Mes</h2>
                                <table>
                                    <caption>Datos de los ingresos del mes</caption>
                                    <tr> 
                                        <th>Tipo</th> 
                                        <th>Nombre del Ingreso</th> 
                                        <th>Cantidad</th>
                                        <th>Fecha</th>
                                    </tr>
                                    ${html2.toString() ?? ""}
                                </table>

                                <h2 style="margin-top: 35px;">Gastos del Mes</h2>
                                <table>
                                    <caption>Datos de los gastos del mes</caption>
                                    <tr> 
                                        <th>Tipo</th> 
                                        <th>Nombre del Gasto</th> 
                                        <th>Precio del Gasto</th>
                                        <th>Categoría del Gasto</th>
                                        <th>Fecha del Gasto</th>
                                    </tr>
                                    ${html3.toString() ?? ""}
                                </table>

                                <h2 style="margin-top: 35px;">Gastos por Categoría</h2>
                                <table>
                                    <caption>Datos de los gastos por categoría</caption>
                                    <tr> 
                                        <th>Nombre de la Categoría</th> 
                                        <th>Total gastado</th>
                                    </tr>
                                    ${html4.toString() ?? ""}
                                </table>
                            </main>
                        </body>

                        <style>
                            body {
                                font-family: Arial, Helvetica, sans-serif;
                            }

                            h2{
                                text-align: center;
                                text-transform: uppercase;
                            }
                            
                            main{
                                width: 100%;
                                margin: 0 auto;
                            } 

                            div{
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                width: 100%;
                            }
                    
                            .cont{
                                display: flex;
                                flex-direction: column;
                                align-items: flex-end;
                            }
                    
                            div img{
                                width: 35px;
                                height: 35px;
                            }

                            table {     
                                font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
                                font-size: 13px;    
                                margin: 45px;
                                text-align: left;    
                                border-collapse: collapse;
                                width: 90%; 
                            }

                            th {     
                                font-size: 15px;     
                                font-weight: 800;     
                                padding: 8px;     
                                background: #b9c9fe;
                                border-top: 4px solid #aabcfe;    
                                border-bottom: 1px solid #fff; color: #039; 
                            }

                            td {    
                                padding: 8px;     
                                background: #e8edff;     
                                border-bottom: 1px solid #fff;
                                color: #669;    
                                border-top: 1px solid transparent; 
                            }

                            tr:hover td { 
                                background: #d0dafd; 
                                color: #339; 
                            }
                        </style>
                    </html>
                `;
                const printToFile = async () => {
                    // On iOS/android prints the given html. On web prints the HTML from the current page.
                    const { uri } = await Print.printToFileAsync({ html });
                    console.log('File has been saved to:', uri);
                    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
                };

                printToFile();
            }}]);
        }
        else{
            Alert.alert("Error", "Para descargar el reporte debes tener gastos ingresados");
        }
    }
    

    return (
        <View style={styles.container}>
            <ScrollView style={styles.contenedorScroll} ref={scrollViewRef}>
                <View style={styles.header}>
                    <Header />          

                    {isValidPresupuesto ? (
                        <ControlPresupuesto 
                            presupuesto={presupuesto}
                            gastos={gastos}
                            reiniciarApp={reiniciarApp}
                        />
                    ) : (     
                        <NuevoPresupuesto 
                            handleNuevoPresupuesto={handleNuevoPresupuesto}
                            nuevoIngreso={nuevoIngreso}
                            setNuevoIngreso={setNuevoIngreso}
                            handleCancelar={handleCancelar}
                            presupuestoEdit={ingresoEdit}
                            handleEditarIngreso={handleEditarIngreso}
                            handleEliminarIngreso={handleEliminarIngreso}
                        />
                    )}
                </View>

                {isValidPresupuesto && (
                    <View style={styles.contenedorInfo}>
                        <View style={styles.contenedorFiltro}>
                            <Text style={styles.label}>Filtro: </Text>
                            <Picker
                                style={styles.input}
                                id='tipo'
                                onValueChange={(itemValue) => setFiltroTipo(itemValue)}
                                selectedValue={filtroTipo}
                            >
                                <Picker.Item label='-- Seleccione --' value={""}/>
                                <Picker.Item label='Ingresos' value={"ingresos"}/>
                                <Picker.Item label='Gastos' value={"gastos"}/>
                            </Picker>

                            {filtroTipo === "gastos" && (
                                <>
                                    <Text style={styles.label}>Categoría: </Text>
                                    <Picker
                                        style={styles.input}
                                        id='tipoC'
                                        onValueChange={(itemValue) => {setFiltroGasto(itemValue)}}
                                        selectedValue={filtroGasto}
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
                                </>
                            )}
                        </View>

                        {filtroTipo === "ingresos" ? (
                            <ListadoIngresos 
                                ingresos={presupuestosFiltro}
                                handleFormEditarIng={handleFormEditarIng}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                pagTot={CANT_PAGINAS_I}
                            />
                        ): filtroTipo === "gastos" ? (
                            <ListadoGastos 
                                gastos={gastosFiltro}
                                handleModalEditar={handleModalEditar}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                pagTot={CANT_PAGINAS}
                            />
                        ) : (
                            <View style={styles.contenedorSinFiltro}>
                                <Text style={styles.sinFiltro}>Seleccione un filtro</Text>
                            </View>
                        )}
                        
                    </View>
                )}
            </ScrollView>
            {modal && (
                <Modal
                    visible={modal}
                    animationType='slide'
                    onRequestClose={() => {
                        setModal(!modal)
                    }}
                >   
                    <FormularioGasto 
                        setModal={setModal}
                        handleGasto={handleGasto}
                        gastoEdit={gastoEdit}
                        handleEditarGasto={handleEditarGasto}
                        setGastoEdit={setGastoEdit}
                        handleEliminarGasto={handleEliminarGasto}
                    />
                </Modal>
            )}

            {isValidPresupuesto && (
                <View style={styles.contenedorBotones}>
                    <Pressable
                        style={styles.contenedorImg}
                        onPress={() => {
                            scrollToTop();
                            setIngresoEdit({});
                            setNuevoIngreso(true);
                            setIsValidPresupuesto(false);
                        }}
                    >
                        <Image  
                            style={styles.img}
                            source={require('./src/img/wallet.png')}
                        />
                    </Pressable>
                    <Pressable
                        style={styles.contenedorImg}
                        onPress={() => {
                            scrollToTop();
                            setModal(!modal);
                        }}
                    >
                        <Image  
                            style={styles.img}
                            source={require('./src/img/nuevo-gasto2.png')}
                        />
                    </Pressable>
                </View>
            )}
            {isValidPresupuesto && (
                <View style={styles.contenedorBotonesIzq}>
                    <Pressable
                        style={styles.contenedorImg}
                        onPress={() => {
                            handlePDF(gastos,presupuesto);
                        }}
                    >
                        <Image  
                            style={styles.img}
                            source={require('./src/img/file.png')}
                        />
                    </Pressable>
                </View>
            )}
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E3E3E3',
        justifyContent: 'flex-start',
    },
    contenedorScroll:{
        flex: 1
    },
    header:{
        backgroundColor: '#0284C7',
        padding: 15,
        paddingTop: 50,
        alignItems: 'center',
    },
    contenedorBotones:{
        position: 'absolute',
        bottom: 15,
        right: 15,
        gap: 15
    },
    contenedorBotonesIzq: {
        position: 'absolute',
        bottom: 15,
        left: 15,
    },  
    img: {
        width: 50,
        height: 50,
    },
    contenedorInfo:{
        marginTop: 60
    },
    contenedorFiltro:{
        ...globalStyles.contenedor,
        transform: [{translateY: 0}],
        width: 'auto',
        marginHorizontal: 15
    },
    label:{
        color: '#64748b',
        textTransform: 'uppercase',
        fontSize: 16,
        fontWeight: '700'
    },
    input:{
        backgroundColor: '#E3E3E3',
        padding: 12,
        borderRadius: 15,
        marginTop: 10
    },
    sinFiltro:{
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 35
    }
});
