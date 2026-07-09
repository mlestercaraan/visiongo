import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

type Quality = 'good' | 'fair' | 'poor' | 'none';

const QUALITY_CONFIG: Record<Quality, { bars: number; color: string; label: string }> = {
  good: { bars: 5, color: Colors.success, label: 'Excellent' },
  fair: { bars: 3, color: Colors.warning, label: 'Fair' },
  poor: { bars: 1, color: Colors.error, label: 'Poor' },
  none: { bars: 0, color: Colors.textMuted, label: 'No Signal' },
};

interface SignalMeterProps {
  quality: Quality;
}

export function SignalMeter({ quality }: SignalMeterProps) {
  const config = QUALITY_CONFIG[quality];

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {[1, 2, 3, 4, 5].map((bar) => (
          <View
            key={bar}
            style={[
              styles.bar,
              { height: 8 + bar * 6 },
              bar <= config.bars
                ? { backgroundColor: config.color }
                : { backgroundColor: Colors.borderLight },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  bar: {
    width: 10,
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});
