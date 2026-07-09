import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AccentStripe } from '../../components/ui/AccentStripe';
import { Colors, Layout } from '../../constants/theme';
import { DEMO_BILLS } from '../../lib/mockData';

type PaymentMethod = 'gcash' | 'maya' | 'card' | 'bank';
type Step = 'select' | 'processing' | 'success';

const METHODS: { id: PaymentMethod; label: string; icon: string; color: string; fee: string }[] = [
  { id: 'gcash', label: 'GCash', icon: 'phone-portrait-outline', color: '#0070CC', fee: 'No fee' },
  { id: 'maya', label: 'Maya', icon: 'wallet-outline', color: '#26A541', fee: 'No fee' },
  { id: 'card', label: 'Credit/Debit Card', icon: 'card-outline', color: '#4F46E5', fee: 'No fee' },
  { id: 'bank', label: 'Bank Transfer', icon: 'business-outline', color: '#0891B2', fee: 'No fee' },
];

function generateRef() {
  return 'AV' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function formatCurrency(amount: number) {
  return `PHP ${amount.toLocaleString('en-PH')}`;
}

export default function PayScreen() {
  const { addPaidBill } = useAppStore();
  const bill = DEMO_BILLS[0];
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [step, setStep] = useState<Step>('select');
  const [refNumber] = useState(generateRef());
  const checkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (step === 'success') {
      Animated.spring(checkAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }).start();
    }
  }, [step]);

  const handlePay = () => {
    if (!selectedMethod) return;
    setStep('processing');
    setTimeout(() => {
      addPaidBill(bill.id);
      setStep('success');
    }, 2000);
  };

  if (step === 'processing') {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerFlex]}>
        <ActivityIndicator size="large" color={Colors.accentNeon} />
        <Text style={styles.processingText}>Processing your payment...</Text>
        <Text style={styles.processingHint}>Please do not close this screen</Text>
      </SafeAreaView>
    );
  }

  if (step === 'success') {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerFlex]}>
        <Animated.View style={[styles.checkCircle, { transform: [{ scale: checkAnim }] }]}>
          <Ionicons name="checkmark" size={40} color={Colors.bgDark} />
        </Animated.View>
        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successAmount}>{formatCurrency(bill.amount_due)}</Text>
        <View style={styles.refCard}>
          <Text style={styles.refLabel}>Transaction Reference</Text>
          <Text style={styles.refNumber}>{refNumber}</Text>
        </View>
        <Text style={styles.successMethod}>{METHODS.find((m) => m.id === selectedMethod)?.label}</Text>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AccentStripe />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pay Bill</Text>
      </View>

      {/* Bill summary */}
      <View style={styles.billSummary}>
        <Text style={styles.billSummaryLabel}>Amount to Pay</Text>
        <Text style={styles.billSummaryAmount}>{formatCurrency(bill.amount_due)}</Text>
        <Text style={styles.billSummaryPeriod}>June 2025 bill</Text>
      </View>

      {/* Payment methods */}
      <View style={styles.methodsSection}>
        <Text style={styles.methodsTitle}>Select Payment Method</Text>
        {METHODS.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[styles.methodCard, selectedMethod === method.id && styles.methodCardActive]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <View style={[styles.methodIcon, { backgroundColor: method.color + '20' }]}>
              <Ionicons name={method.icon as any} size={24} color={method.color} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodLabel}>{method.label}</Text>
              <Text style={styles.methodFee}>{method.fee}</Text>
            </View>
            <View style={[styles.methodRadio, selectedMethod === method.id && styles.methodRadioActive]}>
              {selectedMethod === method.id && <View style={styles.methodRadioDot} />}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.payBtnWrap}>
        <TouchableOpacity
          style={[styles.payBtn, !selectedMethod && styles.payBtnDisabled]}
          onPress={handlePay}
          disabled={!selectedMethod}
        >
          <Text style={styles.payBtnText}>
            {selectedMethod ? `Pay ${formatCurrency(bill.amount_due)}` : 'Select a payment method'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgDark },
  centerFlex: { alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Layout.screenPadding, paddingVertical: 12, gap: 12 },
  back: { padding: 4 },
  headerTitle: { fontSize: 18, color: Colors.textWhite, fontWeight: '800' },
  billSummary: { alignItems: 'center', paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: Colors.borderDark },
  billSummaryLabel: { fontSize: 11, color: Colors.textDim, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  billSummaryAmount: { fontSize: 40, color: Colors.accentNeon, fontWeight: '900', letterSpacing: -1, marginVertical: 4 },
  billSummaryPeriod: { fontSize: 13, color: Colors.textDim },
  methodsSection: { flex: 1, padding: Layout.screenPadding },
  methodsTitle: { fontSize: 14, color: Colors.textOff, fontWeight: '700', marginBottom: 12 },
  methodCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCardDark,
    padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1.5, borderColor: Colors.borderDark,
  },
  methodCardActive: { borderColor: Colors.accentNeon, backgroundColor: 'rgba(0,207,255,0.06)' },
  methodIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  methodInfo: { flex: 1 },
  methodLabel: { fontSize: 15, color: Colors.textWhite, fontWeight: '700' },
  methodFee: { fontSize: 12, color: Colors.textDim },
  methodRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.borderDark, alignItems: 'center', justifyContent: 'center' },
  methodRadioActive: { borderColor: Colors.accentNeon },
  methodRadioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.accentNeon },
  payBtnWrap: { padding: Layout.screenPadding, paddingTop: 0 },
  payBtn: { backgroundColor: Colors.accentNeon, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  payBtnDisabled: { opacity: 0.4 },
  payBtnText: { fontSize: 16, color: Colors.bgDark, fontWeight: '800' },
  processingText: { fontSize: 18, color: Colors.textWhite, fontWeight: '700', marginTop: 20 },
  processingHint: { fontSize: 13, color: Colors.textDim, marginTop: 8 },
  checkCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 24, color: Colors.textWhite, fontWeight: '900', marginBottom: 8 },
  successAmount: { fontSize: 36, color: Colors.accentNeon, fontWeight: '900', letterSpacing: -1, marginBottom: 20 },
  refCard: { backgroundColor: Colors.bgCardDark, padding: 16, borderRadius: 14, alignItems: 'center', marginBottom: 12, width: '85%', borderWidth: 1, borderColor: Colors.borderDark },
  refLabel: { fontSize: 10, color: Colors.textDim, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 },
  refNumber: { fontSize: 22, color: Colors.textWhite, fontWeight: '900', letterSpacing: 2 },
  successMethod: { fontSize: 13, color: Colors.textDim, marginBottom: 32 },
  homeBtn: { backgroundColor: Colors.accentNeon, paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12 },
  homeBtnText: { fontSize: 16, color: Colors.bgDark, fontWeight: '800' },
});
