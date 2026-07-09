import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Colors, Spacing, Radius } from '../../constants/theme';

type FormState = {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  address: string;
  referralCode: string;
};

export default function ApplyScreen() {
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    address: '',
    referralCode: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.mobile.trim() &&
    form.address.trim();

  function setField(key: keyof FormState, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.successBody}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={42} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Application received!</Text>
          <Text style={styles.successMsg}>
            Our team will call you within 24 hours to complete your application.
          </Text>
          <Button
            title="Back to Home"
            variant="primary"
            size="lg"
            style={styles.btnFull}
            onPress={() => router.replace('/(auth)')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.title}>Apply for service</Text>
        <Text style={styles.subtitle}>Fill in your details and we'll get in touch.</Text>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={form.firstName}
              onChangeText={(v) => setField('firstName', v)}
              placeholder="Maria"
              placeholderTextColor={Colors.textMuted}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              value={form.lastName}
              onChangeText={(v) => setField('lastName', v)}
              placeholder="Santos"
              placeholderTextColor={Colors.textMuted}
            />
          </View>
        </View>

        <Text style={styles.label}>Mobile Number *</Text>
        <TextInput
          style={styles.input}
          value={form.mobile}
          onChangeText={(v) => setField('mobile', v)}
          placeholder="09XX XXX XXXX"
          keyboardType="numeric"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={styles.label}>Email (optional)</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(v) => setField('email', v)}
          placeholder="maria@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={styles.label}>Service Address *</Text>
        <TextInput
          style={[styles.input, styles.inputMulti]}
          value={form.address}
          onChangeText={(v) => setField('address', v)}
          placeholder="House no., street, barangay, municipality"
          multiline
          numberOfLines={3}
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={styles.label}>Referral Code (optional)</Text>
        <TextInput
          style={styles.input}
          value={form.referralCode}
          onChangeText={(v) => setField('referralCode', v)}
          placeholder="e.g. SANT-4821-BTG"
          autoCapitalize="characters"
          placeholderTextColor={Colors.textMuted}
        />

        <Button
          title="Submit Application"
          variant="primary"
          size="lg"
          style={styles.btnFull}
          loading={loading}
          disabled={!canSubmit}
          onPress={handleSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgLight,
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  backBtn: {
    paddingVertical: Spacing.md,
    paddingHorizontal: 0,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    color: Colors.textPrimary,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  inputMulti: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  btnFull: {
    width: '100%',
    marginTop: Spacing.md,
  },
  successBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  successTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  successMsg: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
