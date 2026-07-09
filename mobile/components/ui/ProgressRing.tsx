import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

interface ProgressRingProps {
  pct: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function ProgressRing({ pct, size = 80, strokeWidth = 8, label }: ProgressRingProps) {
  const filled = Math.round(pct);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const segments = 20;
  const filledSegments = Math.round((pct / 100) * segments);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth, borderColor: Colors.borderLight }]}>
        <View style={styles.inner}>
          <Text style={styles.pct}>{filled}%</Text>
          {label && <Text style={styles.label}>{label}</Text>}
        </View>
      </View>
      <View style={[
        styles.progress,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: 'transparent',
          borderTopColor: filled > 0 ? Colors.accentNeon : 'transparent',
          borderRightColor: filled > 25 ? Colors.accentNeon : 'transparent',
          borderBottomColor: filled > 50 ? Colors.accentNeon : 'transparent',
          borderLeftColor: filled > 75 ? Colors.accentNeon : 'transparent',
        },
      ]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
  },
  pct: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.accentNeon,
  },
  label: {
    fontSize: 9,
    color: Colors.textDim,
    textAlign: 'center',
  },
  progress: {
    position: 'absolute',
  },
});
