import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ImageBackground } from "react-native";
import { firestore, auth } from "../firebase"; // Inclui 'auth' para autenticar o usuário
import { collection, onSnapshot, query, where, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function Home({ navigation }) {
    const [veiculo, setVeiculo] = useState([]);

    async function deleteVeiculo(id) {
        try {
            await deleteDoc(doc(firestore, 'tblVeiculo', id));
            Alert.alert("Veículo deletado.");
        } catch (error) {
            console.error("Erro ao deletar.", error);
        }
    }

    function confirmDelete(id) {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja excluir este veículo?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", onPress: () => deleteVeiculo(id) },
            ]
        );
    }

    function handleSignOut() {
        signOut(auth)
            .then(() => {
                navigation.replace("LoginStack"); // Navega para a tela de login
            })
            .catch((error) => {
                Alert.alert("Erro", "Não foi possível fazer logout.");
                console.error("Erro ao fazer logout:", error);
            });
    }

    useEffect(() => {
        const user = auth.currentUser; // Obtém o usuário autenticado
        if (!user) {
            Alert.alert("Erro", "Usuário não autenticado.");
            return;
        }

        const q = query(collection(firestore, 'tblVeiculo'), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({ ...doc.data(), id: doc.id });
            });
            setVeiculo(lista);
        });

        return () => unsubscribe();
    }, []);

    return (
        <ImageBackground style={estilo.fundo} source={require('../assets/fundo3.png')}>
            <View style={estilo.container}>
            <TouchableOpacity style={estilo.signOutButton} onPress={handleSignOut}>
                        <Text style={estilo.signOutText}>Sair</Text>
                    </TouchableOpacity>
                <View style={estilo.blocoTitulo}>
                    <Text style={estilo.titulo2}>Lista de Veículos</Text>
                </View>

                <View style={estilo.itensView}>
                    <FlatList
                        data={veiculo}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={estilo.veiculostyle}>
                                <TouchableOpacity onPress={() => navigation.navigate("Change", {
                                    id: item.id,
                                    nomeVeiculo: item.nomeVeiculo,
                                    marcaVeiculo: item.marcaVeiculo,
                                    corVeiculo: item.corVeiculo,
                                    anoFabricacao: item.anoFabricacao,
                                })}>
                                    <View style={estilo.itens}>
                                        <Text style={estilo.titulo4}>Veículo Cadastrado</Text>
                                        <Text style={estilo.titulo3}>Veiculo: {item.nomeVeiculo}</Text>
                                        <Text style={estilo.titulo3}>Marca: {item.marcaVeiculo}</Text>
                                        <Text style={estilo.titulo3}>Cor: {item.corVeiculo}</Text>
                                        <Text style={estilo.titulo3}>Ano: {item.anoFabricacao}</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => confirmDelete(item.id)} style={estilo.botaodeletar}>
                                    <Text style={estilo.deletar}>X</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>

                <TouchableOpacity style={estilo.BtnCadastrar} onPress={() => navigation.navigate("Register")}>
                    <Text style={estilo.cadastrar}>+</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const estilo = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 270,
    },
    blocoTitulo: {
        bottom: 80,
    },

    fundo: {
        flex: 1,
        resizeMode: '',
    },

    fundo2: {
        flex: 1,
        width: 'auto',
        height: '100%',
        borderColor: 'white',
        borderTopWidth: 1.2,
        borderBottomWidth: 1.2,
        margin: 8,
    },

    signOutButton: {
        backgroundColor: "#FF5050",
        padding: 10,
        borderRadius: 5,
        left:170,
        top:-80
    },
    signOutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
       
    },

    itens: {
        borderRadius: 60,
        zIndex: 1,
        color: 'black',
        marginHorizontal: 10,
        marginVertical: 10,
        padding: 10,
        width: 220,
        height: 120,
        justifyContent: 'center',
        textAlign: 'center',
    },

    titulo2: {
        fontSize: 25,
        justifyContent: 'center',
        textAlign: 'center',
        color: "white",
        fontWeight: '900',
        margin: 18,
        textDecorationStyle: 'double',
        textDecorationLine: 'underline',
    },

    titulo3: {
        position: 'relative',
        left: 12,
        justifyContent: 'center',
        textAlign: 'left',
        fontSize: 18,
        fontWeight: '400',
    },

    titulo4: {
        position: 'relative',
        left: 3,
        top: -5,
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
    },

    veiculostyle: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginVertical: 10,
        padding: 10,
        position: 'relative',
    },

    botaodeletar: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#FF5050',
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12.5,
    },

    deletar: {
        fontSize: 18,
        color: "white",
        fontWeight: '800',
    },

    cadastrar: {
        fontSize: 32,
        color: "white",
        fontWeight: '600',
        top: -5,
    },

    BtnCadastrar: {
        fontSize: 80,
        left: '42%',
        bottom: '20%',
        width: 50,
        height: 50,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        borderRadius: 16,
        borderColor: 'white',
        borderWidth: 2,
        marginBottom: 10,
        backgroundColor: '#787878',
    },

    itensView: {
        height: '110%',
        bottom: 80,
    },
});
