import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Colors, Spacing, Radius } from '../../constants/theme';

function isValidPhone(raw: string): boolean {
  const cleaned = raw.replace(/\s/g, '');
  return /^(09\d{9}|639\d{9})$/.test(cleaned);
}

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const valid = isValidPhone(phone);

  async function handleSendOTP() {
    if (!valid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    router.push({ pathname: '/(auth)/otp', params: { phone } });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.textWhite} />
      </TouchableOpacity>

      <View style={styles.body}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Enter your registered mobile number to continue.</Text>

        <View style={styles.inputRow}>
          <View style={styles.prefix}>
            <Text style={styles.prefixText}>+63</Text>
          </View>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="numeric"
            placeholder="9XX XXX XXXX"
            placeholderTextColor={Colors.textDim}
            maxLength={11}
            autoFocus
          />
        </View>

        <Button
          title="Send OTP"
          variant="primary"
          size="lg"
          style={styles.btnFull}
          loading={loading}
          disabled={!valid}
          onPress={handleSendOTP}
        />

        <TouchableOpacity
          style={styles.areaLink}
          onPress={() => router.push('/(auth)/area-check')}
        >
          <Text style={styles.areaLinkText}>Check your area</Text>
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
  backBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.md,
  },
  title: {
    color: Colors.textWhite,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.textOff,
    fontSize: 15,
    marginBottom: Spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCardDark,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  prefix: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: Colors.borderDark,
  },
  prefixText: {
    color: Colors.textOff,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    color: Colors.textWhite,
    fontSize: 18,
    paddingHorizontal: 14,
    paddingVertical: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  btnFull: {
    width: '100%',
  },
  areaLink: {
    alignSelf: 'center',
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
  },
  areaLinkText: {
    color: Colors.accentNeon,
    fontSize: 14,
    fontWeight: '600',
  },
});
