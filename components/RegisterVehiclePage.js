import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ImageBackground } from "react-native";
import { firestore, auth } from '../firebase'; 
import { collection, addDoc } from "firebase/firestore";

export default function RegisterVehicle({ navigation }) {
  const [nomeVeiculo, setNomeVeiculo] = useState("");
  const [marcaVeiculo, setMarcaVeiculo] = useState("");
  const [corVeiculo, setCorVeiculo] = useState("");
  const [anoFabricacao, setAnoFabricacao] = useState("");

  const handleAddVehicle = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("Usuário não autenticado!");
        Alert.alert("Erro", "Você precisa estar logado para cadastrar um veículo.");
        return;
      }

      // Adicionando o veículo à coleção 'tblVeiculo' com o usuário autenticado
      await addDoc(collection(firestore, 'tblVeiculo'), {
        nomeVeiculo,
        marcaVeiculo,
        corVeiculo,
        anoFabricacao,
        userId: user.uid, // Armazenando o ID do usuário para referenciar o veículo
      });

      Alert.alert("Sucesso", "Veículo cadastrado com sucesso!");
      navigation.goBack();  
    } catch (error) {
      console.error("Erro ao cadastrar veículo: ", error);
      Alert.alert("Erro", "Ocorreu um erro ao cadastrar o veículo. Tente novamente.");
    }
  };

  return (
    <ImageBackground style={styles.fundo} resizeMode="cover" source={require('../assets/fundo4.jpg')}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Cadastrar Veículo</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            placeholder="Nome do Veículo"
            value={nomeVeiculo}
            onChangeText={setNomeVeiculo}
          />
          <TextInput
            style={styles.input}
            placeholder="Marca do Veículo"
            value={marcaVeiculo}
            onChangeText={setMarcaVeiculo}
          />
          <TextInput
            style={styles.input}
            placeholder="Cor do Veículo"
            value={corVeiculo}
            onChangeText={setCorVeiculo}
          />
          <TextInput
            style={styles.input}
            placeholder="Ano de Fabricação"
            value={anoFabricacao}
            onChangeText={setAnoFabricacao}
          />

          <TouchableOpacity style={styles.btnenviar} onPress={handleAddVehicle}>
            <Text style={styles.btntxtenviar}>Cadastrar</Text>
          </TouchableOpacity>
          
          
          <TouchableOpacity
            style={[styles.btnenviar, styles.btnVoltar]}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.btntxtenviar}>Voltar</Text>
          </TouchableOpacity>
          
        </View>
        
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fundo: {
    flex: 1,
  },
  titulo: {
    color: 'black',
    marginVertical: 40,
    fontSize: 25,
    textAlign: 'center',
  },
  input: {
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: 'white',
    fontWeight: '700',
    padding: 8,
    width: 260,
    fontSize: 18,
    borderRadius: 10,
  },
  inputView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnenviar: {
    marginTop: 38,
    backgroundColor: '#686868',
    borderColor: '#ffffff',
    borderWidth: 0.6,
    borderRadius: 10,
    padding: 10,
    width: 120,
  },
  btntxtenviar: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
});
