import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import { AccentStripe } from '../../components/ui/AccentStripe';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Colors, Spacing, Layout } from '../../constants/theme';
import { DEMO_BILLS, DEMO_PROMOS, DEMO_TICKETS } from '../../lib/mockData';

function formatCurrency(amount: number) {
  return `PHP ${amount.toLocaleString('en-PH')}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function DashboardScreen() {
  const { subscriber, deviceStatus, unreadCount, paidBillIds } = useAppStore();

  const currentBill = DEMO_BILLS[0];
  const isPaid = paidBillIds.includes(currentBill.id);
  const balance = isPaid ? 0 : currentBill.balance;

  const firstName = subscriber?.first_name ?? 'there';
  const accountNumber = subscriber?.account_number ?? '';
  const planName = 'Fiber 100 Mbps';
  const cpeStatus = deviceStatus?.cpe_status ?? 'online';

  const cpeLabel = cpeStatus === 'online' ? 'Router Online' : cpeStatus === 'issue' ? 'Router Issue Detected' : 'Router Offline';
  const cpeDotColor = cpeStatus === 'online' ? Colors.success : cpeStatus === 'issue' ? Colors.warning : Colors.textMuted;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AccentStripe />

      <View style={styles.header}>
        <View>
          <Text style={styles.greetingSmall}>{greeting},</Text>
          <Text style={styles.greetingName}>{firstName}</Text>
        </View>
        <TouchableOpacity style={styles.bellWrap} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={24} color={Colors.textWhite} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Account card */}
        <View style={styles.accountCard}>
          <View style={styles.accountRow}>
            <Text style={styles.accountNum}>Account {accountNumber}</Text>
            <StatusBadge status={subscriber?.subscription_status ?? 'active'} size="sm" />
          </View>
          <Text style={styles.planName}>{planName}</Text>

          <TouchableOpacity style={styles.cpeRow} onPress={() => router.push('/device')}>
            <View style={[styles.cpeDot, { backgroundColor: cpeDotColor }]} />
            <Text style={styles.cpeLabel}>{cpeLabel}</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.textDim} />
          </TouchableOpacity>

          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Outstanding Balance</Text>
            {balance > 0 ? (
              <>
                <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
                <Text style={styles.balanceDue}>Due {formatDate(currentBill.due_date)}</Text>
              </>
            ) : (
              <Text style={styles.balancePaid}>All paid up!</Text>
            )}
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.qaBtn} onPress={() => router.push('/pay/bill-001')}>
            <View style={[styles.qaIcon, { backgroundColor: 'rgba(0,207,255,0.12)' }]}>
              <Ionicons name="card-outline" size={22} color={Colors.accentNeon} />
            </View>
            <Text style={styles.qaLabel}>Pay Bill</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qaBtn} onPress={() => router.push('/(tabs)/support')}>
            <View style={[styles.qaIcon, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
              <Ionicons name="alert-circle-outline" size={22} color={Colors.error} />
            </View>
            <Text style={styles.qaLabel}>Report Issue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.qaBtn} onPress={() => router.push('/plans')}>
            <View style={[styles.qaIcon, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
              <Ionicons name="arrow-up-circle-outline" size={22} color={Colors.success} />
            </View>
            <Text style={styles.qaLabel}>Upgrade Plan</Text>
          </TouchableOpacity>
        </View>

        {/* CPE alert banner */}
        {cpeStatus !== 'online' && (
          <TouchableOpacity style={styles.cpeBanner} onPress={() => router.push('/device')}>
            <Ionicons name="warning" size={16} color={Colors.bgDark} />
            <Text style={styles.cpeBannerText}>Issue detected with your router</Text>
            <Text style={styles.cpeBannerCta}>Check Now</Text>
          </TouchableOpacity>
        )}

        {/* News & Promos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>News & Offers</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll}>
            {DEMO_PROMOS.map((promo, i) => {
              const promoColors = ['#065A82', '#7C3AED', '#047857'];
              const bg = promoColors[i % promoColors.length];
              return (
                <TouchableOpacity key={promo.id} style={[styles.promoCard, { backgroundColor: bg }]}>
                  <Text style={styles.promoTitle}>{promo.title}</Text>
                  <Text style={styles.promoSub}>{promo.subtitle}</Text>
                  {promo.cta_text && (
                    <View style={styles.promoCta}>
                      <Text style={styles.promoCtaText}>{promo.cta_text}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Active ticket */}
        {DEMO_TICKETS.filter((t) => t.status === 'open' || t.status === 'in_progress').map((ticket) => (
          <TouchableOpacity key={ticket.id} style={styles.ticketCard} onPress={() => router.push(`/ticket/${ticket.id}`)}>
            <View style={styles.ticketRow}>
              <View>
                <Text style={styles.ticketNum}>{ticket.ticket_number}</Text>
                <Text style={styles.ticketCat}>{ticket.category}</Text>
              </View>
              <StatusBadge status={ticket.status as any} size="sm" />
            </View>
            <Text style={styles.ticketSubject} numberOfLines={1}>{ticket.subject}</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgDark },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding, paddingVertical: 12, backgroundColor: Colors.bgDark,
  },
  greetingSmall: { fontSize: 11, color: Colors.textDim, fontWeight: '500' },
  greetingName: { fontSize: 18, color: Colors.textWhite, fontWeight: '800' },
  bellWrap: { position: 'relative', padding: 4 },
  badge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: Colors.error, width: 16, height: 16, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { fontSize: 9, color: '#fff', fontWeight: '700' },
  scroll: { flex: 1, backgroundColor: Colors.bgLight },
  accountCard: {
    backgroundColor: Colors.bgCardDark, padding: Layout.screenPadding, marginBottom: 4,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
  accountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  accountNum: { fontSize: 12, color: Colors.textDim, fontWeight: '500' },
  planName: { fontSize: 17, color: Colors.textWhite, fontWeight: '700', marginBottom: 10 },
  cpeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  cpeDot: { width: 8, height: 8, borderRadius: 4 },
  cpeLabel: { fontSize: 12, color: Colors.textOff, flex: 1 },
  balanceSection: { borderTopWidth: 1, borderTopColor: Colors.borderDark, paddingTop: 14 },
  balanceLabel: { fontSize: 11, color: Colors.textDim, fontWeight: '600', letterSpacing: 0.5, marginBottom: 4 },
  balanceAmount: { fontSize: 32, color: Colors.warning, fontWeight: '900', letterSpacing: -0.5 },
  balanceDue: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  balancePaid: { fontSize: 20, color: Colors.success, fontWeight: '800' },
  quickActions: {
    flexDirection: 'row', backgroundColor: Colors.bgCardLight,
    paddingVertical: 16, paddingHorizontal: Layout.screenPadding,
    gap: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  qaBtn: { flex: 1, alignItems: 'center', gap: 6 },
  qaIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  qaLabel: { fontSize: 11, color: Colors.textPrimary, fontWeight: '600', textAlign: 'center' },
  cpeBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.warning, padding: 12, marginHorizontal: Layout.screenPadding, marginTop: 12, borderRadius: 10,
  },
  cpeBannerText: { flex: 1, fontSize: 12, color: Colors.bgDark, fontWeight: '600' },
  cpeBannerCta: { fontSize: 12, color: Colors.bgDark, fontWeight: '800', textDecorationLine: 'underline' },
  section: { padding: Layout.screenPadding, paddingBottom: 0 },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '800', marginBottom: 12 },
  promoScroll: { marginHorizontal: -Layout.screenPadding, paddingHorizontal: Layout.screenPadding },
  promoCard: {
    width: 220, padding: 16, borderRadius: 14, marginRight: 12, marginBottom: 4,
  },
  promoTitle: { fontSize: 15, color: '#fff', fontWeight: '800', marginBottom: 4 },
  promoSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 12 },
  promoCta: { backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' },
  promoCtaText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  ticketCard: {
    backgroundColor: Colors.bgCardLight, margin: Layout.screenPadding, marginTop: 12,
    padding: 14, borderRadius: 14, borderWidth: 1, borderColor: Colors.borderLight,
    borderLeftWidth: 3, borderLeftColor: Colors.warning,
  },
  ticketRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  ticketNum: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  ticketCat: { fontSize: 13, color: Colors.textSecondary, fontWeight: '700' },
  ticketSubject: { fontSize: 13, color: Colors.textSecondary },
});
