import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  dark?: boolean;
  style?: ViewStyle;
  noPadding?: boolean;
}

export function Card({ children, dark = false, style, noPadding = false }: CardProps) {
  return (
    <View style={[
      styles.card,
      dark ? styles.cardDark : styles.cardLight,
      noPadding && styles.noPadding,
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    padding: 16,
    marginBottom: 12,
  },
  cardDark: {
    backgroundColor: Colors.bgCardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  cardLight: {
    backgroundColor: Colors.bgCardLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  noPadding: {
    padding: 0,
  },
});
