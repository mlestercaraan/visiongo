import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AccentStripe } from '../../components/ui/AccentStripe';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Colors, Layout } from '../../constants/theme';
import { DEMO_BILLS } from '../../lib/mockData';

function formatCurrency(amount: number) {
  return `PHP ${amount.toLocaleString('en-PH')}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatMonth(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' });
}

export default function BillingScreen() {
  const { paidBillIds } = useAppStore();
  const [autoPay, setAutoPay] = useState(false);

  const currentBill = DEMO_BILLS[0];
  const isPaid = paidBillIds.includes(currentBill.id);
  const balance = isPaid ? 0 : currentBill.balance;
  const status = isPaid ? 'paid' : currentBill.status;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AccentStripe />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Billing</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Current bill card */}
        <View style={styles.currentCard}>
          <Text style={styles.periodLabel}>Billing Period</Text>
          <Text style={styles.period}>{formatMonth(currentBill.billing_period_start)}</Text>
          <Text style={styles.amountLabel}>Amount Due</Text>
          <Text style={[styles.amount, isPaid && styles.amountPaid]}>
            {formatCurrency(balance)}
          </Text>
          <View style={styles.billRow}>
            <Text style={styles.dueText}>Due: {formatDate(currentBill.due_date)}</Text>
            <StatusBadge status={status as any} size="sm" />
          </View>
          <TouchableOpacity
            style={[styles.payBtn, isPaid && styles.payBtnPaid]}
            onPress={() => !isPaid && router.push('/pay/bill-001')}
            disabled={isPaid}
          >
            <Text style={[styles.payBtnText, isPaid && styles.payBtnTextPaid]}>
              {isPaid ? 'Paid - Thank you!' : 'Pay Now'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill History</Text>
          {DEMO_BILLS.map((bill) => {
            const billPaid = paidBillIds.includes(bill.id);
            const billStatus = billPaid ? 'paid' : bill.status;
            return (
              <View key={bill.id} style={styles.billRow2}>
                <View style={styles.billLeft}>
                  <Text style={styles.billMonth}>{formatMonth(bill.billing_period_start)}</Text>
                  <Text style={styles.billNum}>{bill.bill_number}</Text>
                </View>
                <View style={styles.billRight}>
                  <Text style={styles.billAmount}>{formatCurrency(bill.amount_due)}</Text>
                  <StatusBadge status={billStatus as any} size="sm" />
                </View>
                <TouchableOpacity style={styles.downloadBtn}>
                  <Ionicons name="download-outline" size={18} color={Colors.accentTeal} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Auto-pay */}
        <View style={styles.autoPayCard}>
          <View style={styles.autoPayLeft}>
            <Ionicons name="refresh-circle-outline" size={24} color={Colors.accentNeon} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.autoPayTitle}>Auto-Pay</Text>
              <Text style={styles.autoPaySub}>Pay automatically every billing cycle</Text>
            </View>
          </View>
          <Switch
            value={autoPay}
            onValueChange={setAutoPay}
            trackColor={{ false: Colors.borderLight, true: Colors.accentNeon }}
            thumbColor={autoPay ? Colors.bgDark : '#fff'}
          />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgDark },
  header: {
    paddingHorizontal: Layout.screenPadding, paddingVertical: 14,
    backgroundColor: Colors.bgDark, borderBottomWidth: 1, borderBottomColor: Colors.borderDark,
  },
  headerTitle: { fontSize: 20, color: Colors.textWhite, fontWeight: '800' },
  scroll: { flex: 1, backgroundColor: Colors.bgLight },
  currentCard: {
    backgroundColor: Colors.bgCardDark, padding: Layout.screenPadding,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
  periodLabel: { fontSize: 10, color: Colors.textDim, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  period: { fontSize: 16, color: Colors.textWhite, fontWeight: '700', marginBottom: 16 },
  amountLabel: { fontSize: 11, color: Colors.textDim, fontWeight: '600', marginBottom: 4 },
  amount: { fontSize: 36, color: Colors.warning, fontWeight: '900', letterSpacing: -1, marginBottom: 10 },
  amountPaid: { color: Colors.success },
  billRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  dueText: { fontSize: 12, color: Colors.textMuted },
  payBtn: { backgroundColor: Colors.accentNeon, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  payBtnPaid: { backgroundColor: 'rgba(16,185,129,0.15)' },
  payBtnText: { fontSize: 16, color: Colors.bgDark, fontWeight: '700' },
  payBtnTextPaid: { color: Colors.success },
  section: { padding: Layout.screenPadding },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '800', marginBottom: 12 },
  billRow2: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCardLight,
    padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: Colors.borderLight,
  },
  billLeft: { flex: 1 },
  billMonth: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700' },
  billNum: { fontSize: 11, color: Colors.textMuted },
  billRight: { alignItems: 'flex-end', gap: 4, marginRight: 12 },
  billAmount: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700' },
  downloadBtn: { padding: 4 },
  autoPayCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.bgCardLight, marginHorizontal: Layout.screenPadding,
    padding: 16, borderRadius: 14, borderWidth: 1, borderColor: Colors.borderLight,
  },
  autoPayLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  autoPayTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700' },
  autoPaySub: { fontSize: 12, color: Colors.textSecondary },
});
