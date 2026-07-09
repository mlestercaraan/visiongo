import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AccentStripe } from '../../components/ui/AccentStripe';
import { Button } from '../../components/ui/Button';
import { Colors, Layout } from '../../constants/theme';
import { DEMO_ENRICHMENT_QUESTIONS, DEMO_ENRICHMENT } from '../../lib/mockData';

export default function ProfileScreen() {
  const { subscriber, setSubscriber } = useAppStore();
  const [activeTab, setActiveTab] = useState<'info' | 'points'>('info');
  const [email, setEmail] = useState(subscriber?.email ?? '');
  const [saving, setSaving] = useState(false);
  const [answeredKeys, setAnsweredKeys] = useState<string[]>(
    Object.keys(DEMO_ENRICHMENT.answers)
  );
  const [pointsBalance, setPointsBalance] = useState(subscriber?.points_balance ?? 230);
  const [localAnswers, setLocalAnswers] = useState<Record<string, string | boolean>>({});
  const [justEarned, setJustEarned] = useState<string | null>(null);
  const earnAnim = useRef(new Animated.Value(0)).current;

  const unansweredQuestions = DEMO_ENRICHMENT_QUESTIONS.filter(
    (q) => !answeredKeys.includes(q.question_key)
  );

  const enrichmentPct = Math.round((answeredKeys.length / DEMO_ENRICHMENT_QUESTIONS.length) * 100);

  const handleSaveInfo = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    Alert.alert('Saved', 'Your profile has been updated.');
  };

  const handleAnswer = (questionKey: string, pts: number) => {
    if (!localAnswers[questionKey] && localAnswers[questionKey] !== false) return;
    setAnsweredKeys((prev) => [...prev, questionKey]);
    const newBalance = pointsBalance + pts;
    setPointsBalance(newBalance);
    setJustEarned(`+${pts} pts`);
    earnAnim.setValue(0);
    Animated.sequence([
      Animated.timing(earnAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(earnAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setJustEarned(null));
    if (subscriber) setSubscriber({ ...subscriber, points_balance: newBalance });
  };

  const initials = subscriber
    ? (subscriber.first_name[0] + subscriber.last_name[0]).toUpperCase()
    : 'AV';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AccentStripe />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.tabRow}>
        {(['info', 'points'] as const).map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab === 'info' ? 'My Info' : 'Earn Points'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'info' ? (
          <View style={styles.section}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <Text style={styles.avatarName}>{subscriber?.first_name} {subscriber?.last_name}</Text>
              <Text style={styles.avatarAccount}>{subscriber?.account_number}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Mobile Number</Text>
              <Text style={styles.fieldValueLocked}>{subscriber?.mobile}</Text>
              <Text style={styles.fieldHint}>Cannot be changed (this is your login ID)</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput
                style={styles.fieldInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="your@email.com"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Service Address</Text>
              <TextInput
                style={[styles.fieldInput, { minHeight: 60 }]}
                value={subscriber?.service_address ?? ''}
                multiline
                placeholder="Your service address"
                placeholderTextColor={Colors.textMuted}
                editable={false}
              />
            </View>

            <Button title={saving ? 'Saving...' : 'Save Changes'} onPress={handleSaveInfo} loading={saving} style={styles.saveBtn} />
          </View>
        ) : (
          <View style={styles.section}>
            {/* Points balance card */}
            <View style={styles.pointsCard}>
              <Animated.View style={{ position: 'absolute', top: 12, right: 16, opacity: earnAnim, transform: [{ translateY: earnAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }}>
                <Text style={styles.earnPopup}>{justEarned}</Text>
              </Animated.View>
              <Text style={styles.pointsLabel}>Your Points Balance</Text>
              <Text style={styles.pointsAmount}>{pointsBalance.toLocaleString()}</Text>
              <Text style={styles.pointsHint}>Redeem for bill credits and rewards</Text>
            </View>

            {/* Progress ring (text based) */}
            <View style={styles.progressCard}>
              <View style={styles.progressRingSimple}>
                <Text style={styles.progressPct}>{enrichmentPct}%</Text>
                <Text style={styles.progressPctLabel}>complete</Text>
              </View>
              <View style={styles.progressText}>
                <Text style={styles.progressTitle}>Profile Completion</Text>
                <Text style={styles.progressSub}>
                  {answeredKeys.length} of {DEMO_ENRICHMENT_QUESTIONS.length} questions answered
                </Text>
                {enrichmentPct >= 80 && (
                  <Text style={styles.progressUnlocked}>Personalized plan recommendations unlocked!</Text>
                )}
              </View>
            </View>

            {/* Question cards */}
            {unansweredQuestions.length === 0 ? (
              <View style={styles.allDoneCard}>
                <Ionicons name="checkmark-circle" size={32} color={Colors.success} />
                <Text style={styles.allDoneText}>You've answered all questions! Great job.</Text>
              </View>
            ) : (
              unansweredQuestions.map((q) => (
                <View key={q.id} style={styles.questionCard}>
                  <View style={styles.questionTop}>
                    <Text style={styles.questionText}>{q.question_text}</Text>
                    <View style={styles.ptsBadge}>
                      <Text style={styles.ptsBadgeText}>+{q.points_reward} pts</Text>
                    </View>
                  </View>

                  {q.answer_type === 'boolean' && (
                    <View style={styles.boolRow}>
                      {(['Yes', 'No'] as const).map((opt) => (
                        <TouchableOpacity
                          key={opt}
                          style={[styles.boolBtn, localAnswers[q.question_key] === (opt === 'Yes') && styles.boolBtnActive]}
                          onPress={() => setLocalAnswers((prev) => ({ ...prev, [q.question_key]: opt === 'Yes' }))}
                        >
                          <Text style={[styles.boolBtnText, localAnswers[q.question_key] === (opt === 'Yes') && styles.boolBtnTextActive]}>
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {q.answer_type === 'select' && q.options && (
                    <View style={styles.selectRow}>
                      {q.options.map((opt) => (
                        <TouchableOpacity
                          key={opt}
                          style={[styles.selectChip, localAnswers[q.question_key] === opt && styles.selectChipActive]}
                          onPress={() => setLocalAnswers((prev) => ({ ...prev, [q.question_key]: opt }))}
                        >
                          <Text style={[styles.selectChipText, localAnswers[q.question_key] === opt && styles.selectChipTextActive]}>
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <Button
                    title="Submit Answer"
                    onPress={() => handleAnswer(q.question_key, q.points_reward)}
                    style={styles.submitBtn}
                    disabled={localAnswers[q.question_key] === undefined}
                  />
                </View>
              ))
            )}

            <View style={{ height: 24 }} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgDark },
  header: { paddingHorizontal: Layout.screenPadding, paddingVertical: 14, backgroundColor: Colors.bgDark },
  headerTitle: { fontSize: 20, color: Colors.textWhite, fontWeight: '800' },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.bgDark, borderBottomWidth: 1, borderBottomColor: Colors.borderDark },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.accentNeon },
  tabLabel: { fontSize: 14, color: Colors.textDim, fontWeight: '600' },
  tabLabelActive: { color: Colors.accentNeon },
  scroll: { flex: 1, backgroundColor: Colors.bgLight },
  section: { padding: Layout.screenPadding },
  avatarWrap: { alignItems: 'center', marginBottom: 24, paddingTop: 8 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.accentNeon, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { fontSize: 26, fontWeight: '900', color: Colors.bgDark },
  avatarName: { fontSize: 18, color: Colors.textPrimary, fontWeight: '800' },
  avatarAccount: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  fieldInput: {
    backgroundColor: Colors.bgCardLight, borderWidth: 1, borderColor: Colors.borderLight,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.textPrimary,
  },
  fieldValueLocked: { fontSize: 15, color: Colors.textSecondary, paddingVertical: 4 },
  fieldHint: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  saveBtn: { marginTop: 8 },
  pointsCard: {
    backgroundColor: Colors.bgCardDark, padding: 20, borderRadius: 14, marginBottom: 12,
    borderWidth: 1, borderColor: Colors.borderDark, alignItems: 'center', position: 'relative',
  },
  pointsLabel: { fontSize: 11, color: Colors.textDim, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 },
  pointsAmount: { fontSize: 48, color: Colors.accentNeon, fontWeight: '900', letterSpacing: -2 },
  pointsHint: { fontSize: 12, color: Colors.textOff, marginTop: 4 },
  earnPopup: { fontSize: 18, color: Colors.success, fontWeight: '900', textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  progressCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgCardLight,
    padding: 16, borderRadius: 14, marginBottom: 16, borderWidth: 1, borderColor: Colors.borderLight,
  },
  progressRingSimple: {
    width: 60, height: 60, borderRadius: 30, borderWidth: 6, borderColor: Colors.accentNeon,
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  progressPct: { fontSize: 14, color: Colors.accentNeon, fontWeight: '900' },
  progressPctLabel: { fontSize: 8, color: Colors.textMuted },
  progressText: { flex: 1 },
  progressTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700' },
  progressSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  progressUnlocked: { fontSize: 11, color: Colors.success, fontWeight: '700', marginTop: 4 },
  allDoneCard: { alignItems: 'center', padding: 32, gap: 12 },
  allDoneText: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center' },
  questionCard: {
    backgroundColor: Colors.bgCardLight, borderRadius: 14, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  questionTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 8 },
  questionText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600', flex: 1, lineHeight: 20 },
  ptsBadge: { backgroundColor: 'rgba(0,207,255,0.1)', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 99, borderWidth: 1, borderColor: 'rgba(0,207,255,0.2)' },
  ptsBadgeText: { fontSize: 11, color: Colors.accentNeon, fontWeight: '700' },
  boolRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  boolBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.borderLight },
  boolBtnActive: { backgroundColor: Colors.accentNeon, borderColor: Colors.accentNeon },
  boolBtnText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '700' },
  boolBtnTextActive: { color: Colors.bgDark },
  selectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  selectChip: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 99, borderWidth: 1.5, borderColor: Colors.borderLight },
  selectChipActive: { backgroundColor: Colors.accentNeon, borderColor: Colors.accentNeon },
  selectChipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  selectChipTextActive: { color: Colors.bgDark },
  submitBtn: { marginTop: 4 },
});
