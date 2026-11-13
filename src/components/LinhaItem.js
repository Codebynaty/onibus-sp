import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { cores } from '../theme';
import { nomeLinha, rotaLinha } from '../utils';

export default function LinhaItem({ linha, onPress, direita }) {
  return (
    <TouchableOpacity style={s.card} onPress={onPress}>
      <View style={s.badge}>
        <Text style={s.badgeTxt}>{nomeLinha(linha)}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.rota} numberOfLines={2}>{rotaLinha(linha)}</Text>
      </View>
      {direita}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: cores.card, padding: 12, marginHorizontal: 12, marginTop: 8,
    borderRadius: 10, borderWidth: 1, borderColor: cores.borda,
  },
  badge: { backgroundColor: cores.primaria, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, minWidth: 74, alignItems: 'center' },
  badgeTxt: { color: '#fff', fontWeight: '700' },
  rota: { color: cores.texto },
});
