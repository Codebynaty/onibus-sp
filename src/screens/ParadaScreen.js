import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { previsaoDaParada } from '../services/olhoVivo';
import { alternarFavorito, ehFavorito, idParada } from '../storage/storage';
import Estado from '../components/Estado';
import { cores } from '../theme';
import { minutosAte } from '../utils';

const ATUALIZA_MS = 30000;

export default function ParadaScreen({ navigation, route }) {
  const { parada, linha } = route.params; // linha é opcional (destaca a linha escolhida)
  const [previsao, setPrevisao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [favorito, setFavorito] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={alternar} style={{ padding: 8 }}>
          <Ionicons name={favorito ? 'star' : 'star-outline'} size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, favorito]);

  useEffect(() => {
    ehFavorito(idParada(parada)).then(setFavorito);
  }, []);

  async function alternar() {
    const agora = await alternarFavorito({ id: idParada(parada), tipo: 'parada', dados: parada });
    setFavorito(agora);
  }

  const carregar = useCallback(async (inicial = false) => {
    if (inicial) setCarregando(true);
    setErro(null);
    try {
      setPrevisao(await previsaoDaParada(parada.cp));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [parada.cp]);

  useEffect(() => {
    carregar(true);
    const id = setInterval(() => carregar(false), ATUALIZA_MS);
    return () => clearInterval(id);
  }, [carregar]);

  const linhas = previsao?.p?.l ?? [];
  // Linha escolhida na tela anterior aparece primeiro
  const ordenadas = [...linhas].sort((a, b) => (b.cl === linha?.cl) - (a.cl === linha?.cl));

  return (
    <View style={s.tela}>
      <View style={s.cabecalho}>
        <Text style={s.nome}>{parada.np}</Text>
        {parada.ed ? <Text style={s.end}>{parada.ed}</Text> : null}
        {previsao?.hr ? <Text style={s.hora}>Atualizado às {previsao.hr}</Text> : null}
      </View>

      <Estado carregando={carregando} erro={erro} aoTentar={() => carregar(true)} />

      {!carregando && !erro ? (
        <FlatList
          data={ordenadas}
          keyExtractor={(l) => `${l.cl}-${l.sl}`}
          ListEmptyComponent={<Estado vazio="Nenhum ônibus previsto para esta parada no momento." />}
          renderItem={({ item }) => (
            <View style={[s.card, item.cl === linha?.cl && s.cardAtivo]}>
              <Text style={s.linha}>{item.c}</Text>
              <Text style={s.destino}>Destino: {item.lt0}</Text>
              {(item.vs ?? []).length === 0 ? (
                <Text style={s.semPrev}>Sem previsão</Text>
              ) : (
                item.vs.map((v) => {
                  const min = minutosAte(v.t, previsao.hr);
                  return (
                    <View key={v.p} style={s.veiculo}>
                      <Text style={s.min}>{min === 0 ? 'Chegando' : `${min} min`}</Text>
                      <Text style={s.det}>
                        {v.t} · prefixo {v.p}{v.a ? ' · acessível' : ''}
                      </Text>
                    </View>
                  );
                })
              )}
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: { padding: 12, backgroundColor: cores.card, borderBottomWidth: 1, borderColor: cores.borda },
  nome: { fontWeight: '700', fontSize: 16, color: cores.texto },
  end: { color: cores.suave, marginTop: 2 },
  hora: { color: cores.suave, marginTop: 4, fontSize: 12 },
  card: {
    backgroundColor: cores.card, marginHorizontal: 12, marginTop: 8, padding: 12,
    borderRadius: 10, borderWidth: 1, borderColor: cores.borda,
  },
  cardAtivo: { borderColor: cores.primaria, borderWidth: 2 },
  linha: { fontWeight: '700', color: cores.primaria, fontSize: 16 },
  destino: { color: cores.suave, marginBottom: 6 },
  semPrev: { color: cores.suave, fontStyle: 'italic' },
  veiculo: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  min: { fontWeight: '700', color: cores.texto, minWidth: 80 },
  det: { color: cores.suave, fontSize: 12 },
});
