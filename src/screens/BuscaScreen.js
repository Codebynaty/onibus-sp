import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Keyboard, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { buscarLinhas } from '../services/olhoVivo';
import { adicionarHistorico } from '../storage/storage';
import LinhaItem from '../components/LinhaItem';
import Estado from '../components/Estado';
import { cores } from '../theme';

export default function BuscaScreen({ navigation, route }) {
  const [termo, setTermo] = useState('');
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [buscou, setBuscou] = useState(false);

  const buscar = useCallback(async (texto) => {
    const q = (texto ?? termo).trim();
    if (!q) return;
    Keyboard.dismiss();
    setCarregando(true);
    setErro(null);
    try {
      const resultado = await buscarLinhas(q);
      setLinhas(Array.isArray(resultado) ? resultado : []);
      setBuscou(true);
      await adicionarHistorico(q);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [termo]);

  // Quando o usuário toca em um item do Histórico, a busca é refeita aqui
  useEffect(() => {
    const t = route.params?.termo;
    if (t) {
      setTermo(t);
      buscar(t);
    }
  }, [route.params?.ts]);

  return (
    <View style={s.tela}>
      <View style={s.barra}>
        <TextInput
          style={s.input}
          placeholder="Número ou nome da linha (ex.: 8000, Lapa)"
          value={termo}
          onChangeText={setTermo}
          onSubmitEditing={() => buscar()}
          returnKeyType="search"
          autoCorrect={false}
        />
        <TouchableOpacity style={s.botao} onPress={() => buscar()}>
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <Estado
        carregando={carregando}
        erro={erro}
        aoTentar={() => buscar()}
        vazio={!carregando && !erro && buscou && linhas.length === 0 ? 'Nenhuma linha encontrada.' : null}
      />

      {!buscou && !carregando && !erro ? (
        <Text style={s.dica}>Busque uma linha para ver paradas, mapa e previsão de chegada.</Text>
      ) : null}

      <FlatList
        data={linhas}
        keyExtractor={(l) => String(l.cl)}
        renderItem={({ item }) => (
          <LinhaItem linha={item} onPress={() => navigation.navigate('Linha', { linha: item })} />
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  barra: { flexDirection: 'row', gap: 8, padding: 12 },
  input: {
    flex: 1, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12,
    borderWidth: 1, borderColor: cores.borda, height: 46,
  },
  botao: { backgroundColor: cores.primaria, borderRadius: 10, width: 46, height: 46, alignItems: 'center', justifyContent: 'center' },
  dica: { color: cores.suave, textAlign: 'center', marginTop: 24, paddingHorizontal: 24 },
});
