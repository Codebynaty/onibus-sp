import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { cores } from '../theme';

// Mostra carregando, erro (com botão de tentar de novo) ou mensagem de lista vazia
export default function Estado({ carregando, erro, vazio, aoTentar }) {
  if (carregando) {
    return (
      <View style={s.box}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }
  if (erro) {
    return (
      <View style={s.box}>
        <Text style={s.erro}>{erro}</Text>
        {aoTentar ? (
          <TouchableOpacity style={s.btn} onPress={aoTentar}>
            <Text style={s.btnTxt}>Tentar novamente</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
  if (vazio) {
    return (
      <View style={s.box}>
        <Text style={s.vazio}>{vazio}</Text>
      </View>
    );
  }
  return null;
}

const s = StyleSheet.create({
  box: { padding: 24, alignItems: 'center' },
  erro: { color: cores.erro, textAlign: 'center', marginBottom: 12 },
  vazio: { color: cores.suave, textAlign: 'center' },
  btn: { backgroundColor: cores.primaria, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  btnTxt: { color: '#fff', fontWeight: '600' },
});
