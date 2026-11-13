import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { listarHistorico, limparHistorico } from '../storage/storage';
import Estado from '../components/Estado';
import { cores } from '../theme';

export default function HistoricoScreen({ navigation }) {
  const [historico, setHistorico] = useState([]);
  const [carregado, setCarregado] = useState(false);

  useFocusEffect(
    useCallback(() => {
      listarHistorico().then((l) => {
        setHistorico(l);
        setCarregado(true);
      });
    }, [])
  );

  function confirmarLimpar() {
    Alert.alert('Limpar histórico', 'Apagar todas as buscas salvas?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar',
        style: 'destructive',
        onPress: async () => {
          await limparHistorico();
          setHistorico([]);
        },
      },
    ]);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        historico.length > 0 ? (
          <TouchableOpacity onPress={confirmarLimpar} style={{ padding: 8 }}>
            <Ionicons name="trash-outline" size={22} color="#fff" />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, historico.length]);

  function buscarDeNovo(termo) {
    // ts muda a cada toque para forçar a busca mesmo repetindo o termo
    navigation.navigate('Buscar', { termo, ts: Date.now() });
  }

  return (
    <View style={s.tela}>
      <FlatList
        data={historico}
        keyExtractor={(t) => t}
        ListEmptyComponent={carregado ? <Estado vazio="Nenhuma busca ainda." /> : null}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.item} onPress={() => buscarDeNovo(item)}>
            <Ionicons name="time-outline" size={20} color={cores.suave} />
            <Text style={s.txt}>{item}</Text>
            <Ionicons name="arrow-forward" size={18} color={cores.suave} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: cores.card,
    padding: 14, borderBottomWidth: 1, borderColor: cores.borda,
  },
  txt: { flex: 1, color: cores.texto },
});
