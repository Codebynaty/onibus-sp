import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { listarFavoritos, removerFavorito } from '../storage/storage';
import LinhaItem from '../components/LinhaItem';
import Estado from '../components/Estado';
import { cores } from '../theme';

export default function FavoritosScreen({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);
  const [carregado, setCarregado] = useState(false);

  // Recarrega sempre que a aba ganha foco
  useFocusEffect(
    useCallback(() => {
      listarFavoritos().then((l) => {
        setFavoritos(l);
        setCarregado(true);
      });
    }, [])
  );

  async function remover(id) {
    await removerFavorito(id);
    setFavoritos((atual) => atual.filter((f) => f.id !== id));
  }

  const botaoRemover = (id) => (
    <TouchableOpacity onPress={() => remover(id)} style={{ padding: 6 }}>
      <Ionicons name="trash-outline" size={20} color={cores.erro} />
    </TouchableOpacity>
  );

  return (
    <View style={s.tela}>
      <FlatList
        data={favoritos}
        keyExtractor={(f) => f.id}
        ListEmptyComponent={
          carregado ? <Estado vazio="Você ainda não tem favoritos. Toque na estrela dentro de uma linha ou parada." /> : null
        }
        renderItem={({ item }) =>
          item.tipo === 'linha' ? (
            <LinhaItem
              linha={item.dados}
              onPress={() => navigation.navigate('Linha', { linha: item.dados })}
              direita={botaoRemover(item.id)}
            />
          ) : (
            <TouchableOpacity
              style={s.parada}
              onPress={() => navigation.navigate('Parada', { parada: item.dados })}
            >
              <Ionicons name="location" size={22} color={cores.primaria} />
              <View style={{ flex: 1 }}>
                <Text style={s.nome}>{item.dados.np}</Text>
                {item.dados.ed ? <Text style={s.end}>{item.dados.ed}</Text> : null}
              </View>
              {botaoRemover(item.id)}
            </TouchableOpacity>
          )
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  parada: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: cores.card,
    padding: 12, marginHorizontal: 12, marginTop: 8, borderRadius: 10, borderWidth: 1, borderColor: cores.borda,
  },
  nome: { fontWeight: '600', color: cores.texto },
  end: { color: cores.suave, fontSize: 12 },
});
