import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { useAppStore } from '../../store/useAppStore';

const OTP_LENGTH = 6;

export default function OTPScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const inputs = useRef<(TextInput | null)[]>([]);
  const loadDemoSession = useAppStore((s) => s.loadDemoSession);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  function handleDigit(val: string, idx: number) {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    setError('');
    if (val && idx < OTP_LENGTH - 1) {
      inputs.current[idx + 1]?.focus();
    }
    if (next.every((d) => d.length === 1) && next.join('').length === OTP_LENGTH) {
      verifyCode(next.join(''));
    }
  }

  function handleKeyPress(key: string, idx: number) {
    if (key === 'Backspace' && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  }

  async function verifyCode(code: string) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (code === '123456') {
      loadDemoSession();
      router.replace('/(tabs)');
    } else {
      setError('Incorrect code. Please try again.');
      setDigits(Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
    }
    setLoading(false);
  }

  function handleResend() {
    if (countdown > 0) return;
    setCountdown(45);
    setDigits(Array(OTP_LENGTH).fill(''));
    setError('');
    inputs.current[0]?.focus();
  }

  const displayPhone = phone ? `+63 ${phone.replace(/^0/, '')}` : '';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color={Colors.textWhite} />
      </TouchableOpacity>

      <View style={styles.body}>
        <Text style={styles.title}>Enter your code</Text>
        <Text style={styles.subtitle}>
          Sent to{' '}
          <Text style={styles.phoneHighlight}>{displayPhone}</Text>
        </Text>

        <View style={styles.boxRow}>
          {digits.map((d, i) => (
            <TextInput
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              style={[
                styles.box,
                d ? styles.boxFilled : undefined,
                error ? styles.boxError : undefined,
              ]}
              value={d}
              onChangeText={(v) => handleDigit(v.slice(-1), i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          title="Verify"
          variant="primary"
          size="lg"
          style={styles.btnFull}
          loading={loading}
          disabled={digits.some((d) => !d)}
          onPress={() => verifyCode(digits.join(''))}
        />

        <TouchableOpacity onPress={handleResend} disabled={countdown > 0}>
          <Text style={[styles.resendText, countdown > 0 && styles.resendDim]}>
            {countdown > 0
              ? `Resend code in 0:${countdown.toString().padStart(2, '0')}`
              : 'Resend code'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Demo: use code 123456</Text>
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
    alignItems: 'center',
    gap: Spacing.md,
  },
  title: {
    color: Colors.textWhite,
    fontSize: 28,
    fontWeight: '800',
    alignSelf: 'flex-start',
  },
  subtitle: {
    color: Colors.textOff,
    fontSize: 15,
    alignSelf: 'flex-start',
  },
  phoneHighlight: {
    color: Colors.accentNeon,
    fontWeight: '700',
  },
  boxRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: Spacing.md,
  },
  box: {
    width: 48,
    height: 56,
    backgroundColor: Colors.bgCardDark,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  boxFilled: {
    borderColor: Colors.accentNeon,
  },
  boxError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  btnFull: {
    width: '100%',
  },
  resendText: {
    color: Colors.accentNeon,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  resendDim: {
    color: Colors.textDim,
  },
  hint: {
    color: Colors.textDim,
    fontSize: 12,
    marginTop: Spacing.lg,
    fontStyle: 'italic',
  },
});
