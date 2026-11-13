import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { paradasDaLinha, posicaoDaLinha } from '../services/olhoVivo';
import { alternarFavorito, ehFavorito, idLinha } from '../storage/storage';
import Estado from '../components/Estado';
import { cores } from '../theme';
import { nomeLinha, rotaLinha } from '../utils';

const ATUALIZA_MS = 30000;

export default function LinhaScreen({ navigation, route }) {
  const { linha } = route.params;
  const [paradas, setParadas] = useState([]);
  const [onibus, setOnibus] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [favorito, setFavorito] = useState(false);
  const mapRef = useRef(null);

  // Estrela de favorito no cabeçalho
  useLayoutEffect(() => {
    navigation.setOptions({
      title: nomeLinha(linha),
      headerRight: () => (
        <TouchableOpacity onPress={alternar} style={{ padding: 8 }}>
          <Ionicons name={favorito ? 'star' : 'star-outline'} size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, favorito]);

  useEffect(() => {
    ehFavorito(idLinha(linha)).then(setFavorito);
  }, []);

  async function alternar() {
    const agora = await alternarFavorito({ id: idLinha(linha), tipo: 'linha', dados: linha });
    setFavorito(agora);
  }

  const carregarPosicoes = useCallback(async () => {
    try {
      const pos = await posicaoDaLinha(linha.cl);
      setOnibus(Array.isArray(pos?.vs) ? pos.vs : []);
    } catch {
      // mantém as últimas posições em caso de falha pontual
    }
  }, [linha.cl]);

  const carregarTudo = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [ps] = await Promise.all([paradasDaLinha(linha.cl), carregarPosicoes()]);
      setParadas(Array.isArray(ps) ? ps : []);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [linha.cl, carregarPosicoes]);

  useEffect(() => {
    carregarTudo();
    const id = setInterval(carregarPosicoes, ATUALIZA_MS);
    return () => clearInterval(id);
  }, [carregarTudo, carregarPosicoes]);

  // Ajusta o mapa para mostrar todas as paradas
  useEffect(() => {
    if (paradas.length && mapRef.current) {
      mapRef.current.fitToCoordinates(
        paradas.map((p) => ({ latitude: p.py, longitude: p.px })),
        { edgePadding: { top: 40, right: 40, bottom: 40, left: 40 }, animated: false }
      );
    }
  }, [paradas]);

  return (
    <View style={s.tela}>
      <View style={s.cabecalho}>
        <Text style={s.rota}>{rotaLinha(linha)}</Text>
        <Text style={s.info}>
          {onibus.length} ônibus em operação · atualiza a cada 30 s
        </Text>
      </View>

      <Estado carregando={carregando} erro={erro} aoTentar={carregarTudo} />

      {!carregando && !erro ? (
        <>
          <MapView
            ref={mapRef}
            style={s.mapa}
            initialRegion={{ latitude: -23.5505, longitude: -46.6333, latitudeDelta: 0.2, longitudeDelta: 0.2 }}
          >
            {paradas.map((p) => (
              <Marker
                key={`p${p.cp}`}
                coordinate={{ latitude: p.py, longitude: p.px }}
                title={p.np}
                description={p.ed}
                pinColor={cores.primaria}
                onCalloutPress={() => navigation.navigate('Parada', { parada: p, linha })}
              />
            ))}
            {onibus.map((v) => (
              <Marker
                key={`v${v.p}`}
                coordinate={{ latitude: v.py, longitude: v.px }}
                title={`Ônibus ${v.p}`}
                description={v.a ? 'Acessível' : undefined}
                pinColor={cores.destaque}
              />
            ))}
          </MapView>

          <FlatList
            data={paradas}
            keyExtractor={(p) => String(p.cp)}
            ListHeaderComponent={<Text style={s.secao}>Paradas ({paradas.length}) — toque para ver a previsão</Text>}
            ListEmptyComponent={<Estado vazio="Nenhuma parada encontrada para esta linha." />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={s.parada}
                onPress={() => navigation.navigate('Parada', { parada: item, linha })}
              >
                <Ionicons name="location" size={20} color={cores.primaria} />
                <View style={{ flex: 1 }}>
                  <Text style={s.paradaNome}>{item.np}</Text>
                  {item.ed ? <Text style={s.paradaEnd}>{item.ed}</Text> : null}
                </View>
                <Ionicons name="chevron-forward" size={18} color={cores.suave} />
              </TouchableOpacity>
            )}
          />
        </>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: { padding: 12, backgroundColor: cores.card, borderBottomWidth: 1, borderColor: cores.borda },
  rota: { fontWeight: '700', color: cores.texto },
  info: { color: cores.suave, marginTop: 2, fontSize: 12 },
  mapa: { height: 250 },
  secao: { padding: 12, color: cores.suave, fontWeight: '600' },
  parada: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: cores.card,
    paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderColor: cores.borda,
  },
  paradaNome: { color: cores.texto, fontWeight: '600' },
  paradaEnd: { color: cores.suave, fontSize: 12 },
});
