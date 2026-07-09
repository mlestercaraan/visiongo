import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useAppStore } from '../../store/useAppStore';
import { AccentStripe } from '../../components/ui/AccentStripe';
import { Colors, Layout } from '../../constants/theme';
import { DEMO_REFERRALS } from '../../lib/mockData';

const STATUS_CONFIG = {
  invited: { label: 'Invited', color: Colors.accentBlue },
  registered: { label: 'Registered', color: Colors.warning },
  activated: { label: 'Activated', color: Colors.success },
  cancelled: { label: 'Cancelled', color: Colors.textMuted },
};

function maskMobile(mobile: string) {
  return mobile.substring(0, 4) + '***' + mobile.substring(mobile.length - 3);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ReferralScreen() {
  const { subscriber } = useAppStore();
  const code = subscriber?.referral_code ?? 'SANT-4821-BTG';

  const activated = DEMO_REFERRALS.filter((r) => r.status === 'activated');
  const totalRewards = activated.reduce((sum, r) => sum + (r.reward_amount ?? 0), 0);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    Alert.alert('Copied!', `Referral code ${code} copied to clipboard.`);
  };

  const handleShare = () => {
    Share.share({
      message: `Hey! I've been using Asian Vision for my internet in Batangas. Fast and reliable! Use my referral code ${code} when you sign up and we both get a reward. Apply at: asianvision.ph/apply`,
      title: 'Asian Vision Referral',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AccentStripe />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer a Friend</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero code card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Your Referral Code</Text>
          <Text style={styles.heroCode}>{code}</Text>
          <Text style={styles.heroHint}>Share this code with friends and family in Batangas, Quezon, or Zambales</Text>
          <View style={styles.heroBtns}>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
              <Ionicons name="copy-outline" size={16} color={Colors.bgDark} />
              <Text style={styles.copyBtnText}>Copy Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={16} color={Colors.textWhite} />
              <Text style={styles.shareBtnText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rewards summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{DEMO_REFERRALS.length}</Text>
            <Text style={styles.summaryLabel}>Referred</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{activated.length}</Text>
            <Text style={styles.summaryLabel}>Activated</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNum, { color: Colors.success }]}>PHP {totalRewards.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Rewards Earned</Text>
          </View>
        </View>

        {/* How it works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsCard}>
            {[
              { step: '1', text: 'Share your referral code with friends or family' },
              { step: '2', text: 'They apply for Asian Vision internet using your code' },
              { step: '3', text: 'Once they activate their connection, you earn PHP 200 bill credit!' },
            ].map((item) => (
              <View key={item.step} style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{item.step}</Text>
                </View>
                <Text style={styles.stepText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Referral list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Referrals</Text>
          {DEMO_REFERRALS.map((ref) => {
            const config = STATUS_CONFIG[ref.status];
            return (
              <View key={ref.id} style={styles.refRow}>
                <View style={styles.refAvatar}>
                  <Ionicons name="person" size={16} color={Colors.textDim} />
                </View>
                <View style={styles.refInfo}>
                  <Text style={styles.refMobile}>{maskMobile(ref.referee_mobile)}</Text>
                  <Text style={styles.refDate}>Referred {formatDate(ref.created_at)}</Text>
                </View>
                <View style={[styles.refStatus, { backgroundColor: config.color + '20' }]}>
                  <Text style={[styles.refStatusText, { color: config.color }]}>{config.label}</Text>
                </View>
                {ref.status === 'activated' && ref.reward_amount && (
                  <Text style={styles.refReward}>+PHP {ref.reward_amount}</Text>
                )}
              </View>
            );
          })}
        </View>

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
  scroll: { flex: 1, backgroundColor: Colors.bgDark },
  heroCard: { backgroundColor: Colors.bgCardDark, padding: 24, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Colors.borderDark },
  heroLabel: { fontSize: 10, color: Colors.textDim, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },
  heroCode: { fontSize: 32, color: Colors.pink, fontWeight: '900', letterSpacing: 4, marginBottom: 12 },
  heroHint: { fontSize: 12, color: Colors.textDim, textAlign: 'center', lineHeight: 18, marginBottom: 20, maxWidth: 260 },
  heroBtns: { flexDirection: 'row', gap: 10 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.accentNeon, paddingVertical: 11, paddingHorizontal: 20, borderRadius: 10 },
  copyBtnText: { fontSize: 14, color: Colors.bgDark, fontWeight: '700' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 11, paddingHorizontal: 20, borderRadius: 10, borderWidth: 1, borderColor: Colors.borderDark },
  shareBtnText: { fontSize: 14, color: Colors.textWhite, fontWeight: '700' },
  summaryRow: { flexDirection: 'row', backgroundColor: Colors.bgCardDark, padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.borderDark },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNum: { fontSize: 22, color: Colors.accentNeon, fontWeight: '900' },
  summaryLabel: { fontSize: 11, color: Colors.textDim, marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: Colors.borderDark, marginHorizontal: 4 },
  section: { padding: Layout.screenPadding },
  sectionTitle: { fontSize: 16, color: Colors.textOff, fontWeight: '800', marginBottom: 12 },
  stepsCard: { backgroundColor: Colors.bgCardDark, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.borderDark },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 14 },
  stepNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.pink, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNumText: { fontSize: 13, color: '#fff', fontWeight: '900' },
  stepText: { flex: 1, fontSize: 13, color: Colors.textOff, lineHeight: 19 },
  refRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCardDark, padding: 14, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: Colors.borderDark },
  refAvatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  refInfo: { flex: 1 },
  refMobile: { fontSize: 14, color: Colors.textOff, fontWeight: '600' },
  refDate: { fontSize: 11, color: Colors.textDim, marginTop: 2 },
  refStatus: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 99, marginRight: 6 },
  refStatusText: { fontSize: 11, fontWeight: '700' },
  refReward: { fontSize: 13, color: Colors.success, fontWeight: '700' },
});
