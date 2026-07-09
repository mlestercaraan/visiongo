import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AccentStripe } from '../../components/ui/AccentStripe';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Colors, Layout } from '../../constants/theme';
import { DEMO_TICKETS, DEMO_TICKET_UPDATES } from '../../lib/mockData';

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function TicketDetailScreen() {
  const { ticketId } = useLocalSearchParams<{ ticketId: string }>();
  const ticket = DEMO_TICKETS.find((t) => t.id === ticketId) ?? DEMO_TICKETS[0];
  const updates = DEMO_TICKET_UPDATES.filter((u) => u.ticket_id === ticket.id);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AccentStripe />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket Detail</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Status hero */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <StatusBadge status={ticket.status as any} />
            <Text style={styles.ticketNum}>{ticket.ticket_number}</Text>
          </View>
          <Text style={styles.ticketSubject}>{ticket.subject}</Text>
          <Text style={styles.ticketMeta}>{ticket.ticket_type === 'technical' ? 'Technical Issue' : 'Billing Concern'} | {ticket.category}</Text>
          <Text style={styles.ticketDate}>Filed: {formatDateTime(ticket.created_at)}</Text>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Timeline</Text>
          {updates.map((update, i) => (
            <View key={update.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineDot, { backgroundColor: i === updates.length - 1 ? Colors.accentNeon : Colors.textMuted }]} />
                {i < updates.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineStatusRow}>
                  <StatusBadge status={update.status as any} size="sm" />
                  <Text style={styles.timelineTime}>{formatDateTime(update.created_at)}</Text>
                </View>
                {update.message && <Text style={styles.timelineMessage}>{update.message}</Text>}
                <Text style={styles.timelineBy}>
                  {update.updated_by === 'system' ? 'System' : update.updated_by === 'support_agent' ? 'Support Team' : update.updated_by}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {ticket.status === 'resolved' && (
          <View style={styles.section}>
            <View style={styles.ratingCard}>
              <Text style={styles.ratingTitle}>How did we do?</Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star}>
                    <Ionicons name="star-outline" size={32} color={Colors.warning} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgDark },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Layout.screenPadding, paddingVertical: 12, gap: 12 },
  back: { padding: 4 },
  headerTitle: { fontSize: 18, color: Colors.textWhite, fontWeight: '800' },
  scroll: { flex: 1, backgroundColor: Colors.bgLight },
  statusCard: { backgroundColor: Colors.bgCardDark, padding: Layout.screenPadding, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  ticketNum: { fontSize: 12, color: Colors.textDim, fontWeight: '600' },
  ticketSubject: { fontSize: 17, color: Colors.textWhite, fontWeight: '700', marginBottom: 6 },
  ticketMeta: { fontSize: 12, color: Colors.textDim, marginBottom: 4 },
  ticketDate: { fontSize: 12, color: Colors.textDim },
  section: { padding: Layout.screenPadding },
  sectionTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '800', marginBottom: 16 },
  timelineItem: { flexDirection: 'row', marginBottom: 4 },
  timelineLeft: { width: 20, alignItems: 'center', marginRight: 14 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  timelineLine: { width: 2, flex: 1, backgroundColor: Colors.borderLight, marginTop: 4, marginBottom: -4 },
  timelineContent: { flex: 1, paddingBottom: 20 },
  timelineStatusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  timelineTime: { fontSize: 11, color: Colors.textMuted },
  timelineMessage: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 6 },
  timelineBy: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  ratingCard: { backgroundColor: Colors.bgCardLight, borderRadius: 14, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: Colors.borderLight },
  ratingTitle: { fontSize: 15, color: Colors.textPrimary, fontWeight: '700', marginBottom: 14 },
  stars: { flexDirection: 'row', gap: 8 },
});
