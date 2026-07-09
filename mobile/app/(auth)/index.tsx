import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AccentStripe } from '../../components/ui/AccentStripe';
import { Button } from '../../components/ui/Button';
import { Colors, Spacing, Radius } from '../../constants/theme';

export default function LandingScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <AccentStripe />

      <View style={styles.body}>
        <View style={styles.logoBlock}>
          <Text style={styles.logoText}>
            <Text style={styles.logoWhite}>Vision</Text>
            <Text style={styles.logoNeon}>Go</Text>
          </Text>
          <Text style={styles.tagline}>Your connection, on the go.</Text>
        </View>

        <View style={styles.pillsRow}>
          {['Asian Vision', 'Batangas', 'Quezon', 'Zambales'].map((label) => (
            <View key={label} style={styles.pill}>
              <Text style={styles.pillText}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonsBlock}>
          <Button
            title="Sign In"
            variant="primary"
            size="lg"
            style={styles.btnFull}
            onPress={() => router.push('/(auth)/login')}
          />
          <Button
            title="Check coverage in my area"
            variant="outline"
            size="lg"
            style={[styles.btnFull, styles.btnTop]}
            onPress={() => router.push('/(auth)/area-check')}
          />
        </View>

        <TouchableOpacity
          style={styles.applyLink}
          onPress={() => router.push('/(auth)/apply')}
        >
          <Text style={styles.applyText}>
            Not yet a subscriber?{' '}
            <Text style={styles.applyAccent}>Apply now</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
  },
  logoBlock: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  logoWhite: {
    color: Colors.textWhite,
  },
  logoNeon: {
    color: Colors.accentNeon,
  },
  tagline: {
    color: Colors.textDim,
    fontSize: 16,
    fontStyle: 'italic',
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  pill: {
    backgroundColor: 'rgba(0,207,255,0.10)',
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(0,207,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  pillText: {
    color: Colors.textOff,
    fontSize: 12,
    fontWeight: '600',
  },
  buttonsBlock: {
    width: '100%',
    gap: 0,
  },
  btnFull: {
    width: '100%',
  },
  btnTop: {
    marginTop: 12,
  },
  applyLink: {
    paddingVertical: Spacing.sm,
  },
  applyText: {
    color: Colors.textDim,
    fontSize: 14,
  },
  applyAccent: {
    color: Colors.accentNeon,
    fontWeight: '700',
  },
});
