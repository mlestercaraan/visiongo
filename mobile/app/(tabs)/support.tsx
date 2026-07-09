import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AccentStripe } from '../../components/ui/AccentStripe';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Colors, Layout } from '../../constants/theme';
import { DEMO_TICKETS } from '../../lib/mockData';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SupportScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AccentStripe />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Get Help</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What do you need help with?</Text>

          <TouchableOpacity style={styles.optionCard} onPress={() => router.push('/ticket/new')}>
            <View style={[styles.optionIcon, { backgroundColor: 'rgba(0,207,255,0.1)' }]}>
              <Ionicons name="wifi" size={28} color={Colors.accentNeon} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Internet or Connection Problem</Text>
              <Text style={styles.optionSub}>No internet, slow speeds, Wi-Fi issues</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textDim} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={() => router.push('/ticket/new')}>
            <View style={[styles.optionIcon, { backgroundColor: 'rgba(245,158,11,0.1)' }]}>
              <Ionicons name="receipt-outline" size={28} color={Colors.warning} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Billing or Payment Issue</Text>
              <Text style={styles.optionSub}>Wrong charge, payment not reflected, disputes</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textDim} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.callCard} onPress={() => Linking.openURL('tel:18008282253')}>
            <View>
              <Text style={styles.callTitle}>Still need to talk to us?</Text>
              <Text style={styles.callNum}>1-800-AVCABLE</Text>
              <Text style={styles.callHours}>Mon-Sat, 8am to 8pm</Text>
            </View>
            <View style={styles.callBtn}>
              <Ionicons name="call" size={18} color={Colors.bgDark} />
              <Text style={styles.callBtnText}>Call Now</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Tickets</Text>
          {DEMO_TICKETS.length === 0 ? (
            <Text style={styles.emptyText}>No support tickets yet.</Text>
          ) : (
            DEMO_TICKETS.map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                style={styles.ticketRow}
                onPress={() => router.push(`/ticket/${ticket.id}`)}
              >
                <View style={[styles.ticketTypeIcon, { backgroundColor: ticket.ticket_type === 'technical' ? 'rgba(0,207,255,0.1)' : 'rgba(245,158,11,0.1)' }]}>
                  <Ionicons
                    name={ticket.ticket_type === 'technical' ? 'wifi' : 'receipt-outline'}
                    size={16}
                    color={ticket.ticket_type === 'technical' ? Colors.accentNeon : Colors.warning}
                  />
                </View>
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketNum}>{ticket.ticket_number}</Text>
                  <Text style={styles.ticketSubject} numberOfLines={1}>{ticket.subject}</Text>
                  <Text style={styles.ticketDate}>{formatDate(ticket.created_at)}</Text>
                </View>
                <StatusBadge status={ticket.status as any} size="sm" />
              </TouchableOpacity>
            ))
          )}
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
  section: { padding: Layout.screenPadding, paddingBottom: 4 },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '800', marginBottom: 12 },
  optionCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCardDark, padding: 16, borderRadius: 14, marginBottom: 10,
    borderWidth: 1, borderColor: Colors.borderDark,
  },
  optionIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  optionText: { flex: 1 },
  optionTitle: { fontSize: 15, color: Colors.textWhite, fontWeight: '700', marginBottom: 3 },
  optionSub: { fontSize: 12, color: Colors.textOff },
  callCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.bgCardLight, padding: 16, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  callTitle: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  callNum: { fontSize: 18, color: Colors.textPrimary, fontWeight: '800' },
  callHours: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  callBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.success, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10,
  },
  callBtnText: { color: Colors.bgDark, fontWeight: '700', fontSize: 14 },
  ticketRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCardLight,
    padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: Colors.borderLight,
  },
  ticketTypeIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  ticketInfo: { flex: 1 },
  ticketNum: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  ticketSubject: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', marginVertical: 2 },
  ticketDate: { fontSize: 11, color: Colors.textMuted },
  emptyText: { color: Colors.textMuted, textAlign: 'center', padding: 20 },
});
