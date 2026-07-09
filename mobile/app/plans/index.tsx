import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AccentStripe } from '../../components/ui/AccentStripe';
import { Colors, Layout } from '../../constants/theme';
import { DEMO_PLANS, DEMO_CURRENT_PLAN, DEMO_ENRICHMENT } from '../../lib/mockData';

function formatCurrency(amount: number) {
  return `PHP ${amount.toLocaleString('en-PH')}`;
}

export default function PlansScreen() {
  const { subscriber } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [filter, setFilter] = useState<'all' | 'fiber' | 'cable'>('all');

  const hasEnoughEnrichment = (subscriber?.enrichment_pct ?? 0) >= 50 || DEMO_ENRICHMENT.completed_questions >= 3;
  const isOFW = DEMO_ENRICHMENT.has_ofw_member;

  const recommendedPlanIds = isOFW ? ['plan-003', 'plan-004'] : ['plan-003'];
  const filteredPlans = filter === 'all' ? DEMO_PLANS : DEMO_PLANS.filter((p) => p.plan_type === filter);

  const handleUpgrade = () => {
    setUpgradeModal(false);
    setUpgradeSuccess(true);
  };

  const upgradeTarget = DEMO_PLANS.find((p) => p.id === selectedPlan);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AccentStripe />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plans</Text>
      </View>

      {upgradeSuccess ? (
        <View style={styles.successWrap}>
          <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
          <Text style={styles.successTitle}>Upgrade Requested!</Text>
          <Text style={styles.successBody}>
            We'll call you within 24 hours to schedule your upgrade to {upgradeTarget?.plan_name}.
          </Text>
          <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Current plan */}
          <View style={styles.currentCard}>
            <Text style={styles.currentLabel}>Your Current Plan</Text>
            <Text style={styles.currentName}>{DEMO_CURRENT_PLAN.plan_name}</Text>
            <Text style={styles.currentDetails}>
              {DEMO_CURRENT_PLAN.speed_down_mbps} Mbps  |  {formatCurrency(DEMO_CURRENT_PLAN.monthly_fee)}/month
            </Text>
          </View>

          {/* Recommended */}
          {hasEnoughEnrichment && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: Colors.accentNeon }]}>Recommended for Your Household</Text>
              {DEMO_PLANS.filter((p) => recommendedPlanIds.includes(p.id)).map((plan) => (
                <View key={plan.id} style={[styles.planCard, styles.planCardRecommended]}>
                  <View style={styles.planCardTop}>
                    <View>
                      <Text style={styles.planName}>{plan.plan_name}</Text>
                      {isOFW && <Text style={styles.planTag}>OFW Family</Text>}
                    </View>
                    <Text style={styles.planPrice}>{formatCurrency(plan.monthly_fee)}<Text style={styles.planPriceSub}>/mo</Text></Text>
                  </View>
                  <Text style={styles.planSpeed}>{plan.speed_down_mbps} Mbps download + upload</Text>
                  {plan.features.slice(0, 3).map((f, i) => (
                    <View key={i} style={styles.featureRow}>
                      <Ionicons name="checkmark" size={14} color={Colors.accentNeon} />
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                  <TouchableOpacity style={styles.upgradeBtn} onPress={() => { setSelectedPlan(plan.id); setUpgradeModal(true); }}>
                    <Text style={styles.upgradeBtnText}>Upgrade to This Plan</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Filters */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Plans</Text>
            <View style={styles.filterRow}>
              {(['all', 'fiber', 'cable'] as const).map((f) => (
                <TouchableOpacity key={f} style={[styles.filterChip, filter === f && styles.filterChipActive]} onPress={() => setFilter(f)}>
                  <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {filteredPlans.map((plan) => {
              const isCurrent = plan.plan_code === DEMO_CURRENT_PLAN.plan_code;
              return (
                <View key={plan.id} style={[styles.planCard, isCurrent && styles.planCardCurrent]}>
                  <View style={styles.planCardTop}>
                    <View>
                      <Text style={styles.planName}>{plan.plan_name}</Text>
                      {plan.is_featured && <Text style={styles.featuredTag}>Most Popular</Text>}
                    </View>
                    <Text style={styles.planPrice}>{formatCurrency(plan.monthly_fee)}<Text style={styles.planPriceSub}>/mo</Text></Text>
                  </View>
                  <Text style={styles.planSpeed}>{plan.speed_down_mbps} Mbps download + upload</Text>
                  {plan.features.slice(0, 3).map((f, i) => (
                    <View key={i} style={styles.featureRow}>
                      <Ionicons name="checkmark" size={14} color={isCurrent ? Colors.textMuted : Colors.success} />
                      <Text style={[styles.featureText, isCurrent && { color: Colors.textMuted }]}>{f}</Text>
                    </View>
                  ))}
                  {isCurrent ? (
                    <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>Current Plan</Text></View>
                  ) : (
                    <TouchableOpacity style={styles.upgradeBtn} onPress={() => { setSelectedPlan(plan.id); setUpgradeModal(true); }}>
                      <Text style={styles.upgradeBtnText}>Upgrade to This Plan</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
          <View style={{ height: 24 }} />
        </ScrollView>
      )}

      <Modal visible={upgradeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirm Upgrade Request</Text>
            <View style={styles.modalPlanRow}>
              <View style={styles.modalPlanBox}>
                <Text style={styles.modalPlanLabel}>Current</Text>
                <Text style={styles.modalPlanName}>{DEMO_CURRENT_PLAN.plan_name}</Text>
                <Text style={styles.modalPlanPrice}>{formatCurrency(DEMO_CURRENT_PLAN.monthly_fee)}/mo</Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color={Colors.accentNeon} />
              <View style={[styles.modalPlanBox, styles.modalPlanBoxNew]}>
                <Text style={styles.modalPlanLabel}>New Plan</Text>
                <Text style={styles.modalPlanName}>{upgradeTarget?.plan_name}</Text>
                <Text style={styles.modalPlanPrice}>{upgradeTarget ? formatCurrency(upgradeTarget.monthly_fee) : ''}/mo</Text>
              </View>
            </View>
            <Text style={styles.modalBody}>Our team will call you within 24 hours to schedule your upgrade.</Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setUpgradeModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleUpgrade}>
                <Text style={styles.modalConfirmText}>Request Upgrade</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgDark },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Layout.screenPadding, paddingVertical: 12, gap: 12 },
  back: { padding: 4 },
  headerTitle: { fontSize: 18, color: Colors.textWhite, fontWeight: '800' },
  scroll: { flex: 1, backgroundColor: Colors.bgLight },
  currentCard: { backgroundColor: Colors.bgCardDark, padding: Layout.screenPadding, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginBottom: 4 },
  currentLabel: { fontSize: 10, color: Colors.accentNeon, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  currentName: { fontSize: 22, color: Colors.textWhite, fontWeight: '900' },
  currentDetails: { fontSize: 13, color: Colors.textDim, marginTop: 4 },
  section: { padding: Layout.screenPadding, paddingBottom: 0 },
  sectionTitle: { fontSize: 16, color: Colors.textPrimary, fontWeight: '800', marginBottom: 12 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  filterChip: { paddingVertical: 7, paddingHorizontal: 16, borderRadius: 99, borderWidth: 1.5, borderColor: Colors.borderLight },
  filterChipActive: { backgroundColor: Colors.bgDark, borderColor: Colors.bgDark },
  filterChipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  filterChipTextActive: { color: Colors.textWhite },
  planCard: { backgroundColor: Colors.bgCardLight, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1.5, borderColor: Colors.borderLight },
  planCardRecommended: { borderColor: Colors.accentNeon, backgroundColor: 'rgba(0,207,255,0.04)' },
  planCardCurrent: { borderColor: Colors.borderLight, opacity: 0.65 },
  planCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  planName: { fontSize: 17, color: Colors.textPrimary, fontWeight: '800' },
  planTag: { fontSize: 10, color: Colors.pink, fontWeight: '700', marginTop: 2 },
  featuredTag: { fontSize: 10, color: Colors.success, fontWeight: '700', marginTop: 2 },
  planPrice: { fontSize: 22, color: Colors.textPrimary, fontWeight: '900' },
  planPriceSub: { fontSize: 12, fontWeight: '400', color: Colors.textMuted },
  planSpeed: { fontSize: 13, color: Colors.textSecondary, marginBottom: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  featureText: { fontSize: 13, color: Colors.textSecondary },
  upgradeBtn: { marginTop: 12, backgroundColor: Colors.bgDark, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  upgradeBtnText: { fontSize: 14, color: Colors.accentNeon, fontWeight: '700' },
  currentBadge: { marginTop: 12, backgroundColor: 'rgba(2,27,58,0.06)', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  currentBadgeText: { fontSize: 13, color: Colors.textMuted, fontWeight: '600' },
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successTitle: { fontSize: 24, color: Colors.textWhite, fontWeight: '900', marginTop: 16 },
  successBody: { fontSize: 14, color: Colors.textOff, textAlign: 'center', marginTop: 10, lineHeight: 22, marginBottom: 32 },
  homeBtn: { backgroundColor: Colors.accentNeon, paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12 },
  homeBtnText: { fontSize: 16, color: Colors.bgDark, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.bgCardLight, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '800', marginBottom: 20, textAlign: 'center' },
  modalPlanRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 16 },
  modalPlanBox: { alignItems: 'center', backgroundColor: 'rgba(2,27,58,0.05)', padding: 14, borderRadius: 12, flex: 1 },
  modalPlanBoxNew: { backgroundColor: 'rgba(0,207,255,0.06)', borderWidth: 1.5, borderColor: Colors.accentNeon },
  modalPlanLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  modalPlanName: { fontSize: 14, color: Colors.textPrimary, fontWeight: '800', textAlign: 'center' },
  modalPlanPrice: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  modalBody: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  modalBtns: { flexDirection: 'row', gap: 12 },
  modalCancel: { flex: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.borderLight },
  modalCancelText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '700' },
  modalConfirm: { flex: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center', backgroundColor: Colors.bgDark },
  modalConfirmText: { fontSize: 15, color: Colors.accentNeon, fontWeight: '700' },
});
