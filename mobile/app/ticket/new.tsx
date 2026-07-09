import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { AccentStripe } from '../../components/ui/AccentStripe';
import { Button } from '../../components/ui/Button';
import { Colors, Layout } from '../../constants/theme';

type TicketType = 'technical' | 'billing';
const TECH_CATEGORIES = ['No internet', 'Slow speed', 'Wi-Fi issue', 'Other'];
const BILLING_CATEGORIES = ['Wrong charge', 'Payment not reflected', 'Dispute', 'Other'];

function generateTicketNum() {
  return 'AV-TKT-' + Math.floor(10000000 + Math.random() * 90000000);
}

export default function NewTicketScreen() {
  const [type, setType] = useState<TicketType>('technical');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNum] = useState(generateTicketNum());

  const categories = type === 'technical' ? TECH_CATEGORIES : BILLING_CATEGORIES;

  const handleSubmit = async () => {
    if (!category || !description.trim()) {
      Alert.alert('Missing Information', 'Please select a category and describe your issue.');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
        <Text style={styles.successTitle}>Ticket Received!</Text>
        <Text style={styles.successRef}>Reference: {ticketNum}</Text>
        <Text style={styles.successBody}>
          Our support team will review your concern and get back to you within 24 hours.
        </Text>
        <Button title="View My Tickets" onPress={() => router.replace('/(tabs)/support')} style={styles.viewBtn} />
        <Button title="Back to Home" onPress={() => router.replace('/(tabs)')} variant="ghost" style={styles.homeBtn} />
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
        <Text style={styles.headerTitle}>New Support Ticket</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {/* Type selector */}
          <Text style={styles.fieldLabel}>Issue Type</Text>
          <View style={styles.typeRow}>
            <TouchableOpacity style={[styles.typeBtn, type === 'technical' && styles.typeBtnActive]} onPress={() => { setType('technical'); setCategory(''); }}>
              <Ionicons name="wifi" size={16} color={type === 'technical' ? Colors.bgDark : Colors.textSecondary} />
              <Text style={[styles.typeBtnText, type === 'technical' && styles.typeBtnTextActive]}>Technical</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.typeBtn, type === 'billing' && styles.typeBtnActive]} onPress={() => { setType('billing'); setCategory(''); }}>
              <Ionicons name="receipt-outline" size={16} color={type === 'billing' ? Colors.bgDark : Colors.textSecondary} />
              <Text style={[styles.typeBtnText, type === 'billing' && styles.typeBtnTextActive]}>Billing</Text>
            </TouchableOpacity>
          </View>

          {/* Category */}
          <Text style={styles.fieldLabel}>Category</Text>
          <View style={styles.categoryRow}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, category === cat && styles.catChipActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.fieldLabel}>Describe Your Issue</Text>
          <TextInput
            style={styles.textarea}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            placeholder="Please describe what's happening in detail..."
            placeholderTextColor={Colors.textMuted}
            textAlignVertical="top"
          />

          {/* Photo hint */}
          <TouchableOpacity style={styles.photoBtn}>
            <Ionicons name="camera-outline" size={18} color={Colors.accentTeal} />
            <Text style={styles.photoBtnText}>Add a photo (optional)</Text>
          </TouchableOpacity>

          {type === 'technical' && (
            <View style={styles.selfHelpNote}>
              <Ionicons name="information-circle-outline" size={16} color={Colors.accentNeon} />
              <Text style={styles.selfHelpText}>
                Before submitting, you can try our one-click router restart in the Router Status screen - it resolves most connection issues instantly.
              </Text>
            </View>
          )}

          <Button title={submitting ? 'Submitting...' : 'Submit Ticket'} onPress={handleSubmit} loading={submitting} style={styles.submitBtn} size="lg" />
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgDark },
  center: { alignItems: 'center', justifyContent: 'center', padding: 32 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Layout.screenPadding, paddingVertical: 12, gap: 12 },
  back: { padding: 4 },
  headerTitle: { fontSize: 18, color: Colors.textWhite, fontWeight: '800' },
  scroll: { flex: 1, backgroundColor: Colors.bgLight },
  section: { padding: Layout.screenPadding },
  fieldLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginTop: 16 },
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.borderLight },
  typeBtnActive: { backgroundColor: Colors.accentNeon, borderColor: Colors.accentNeon },
  typeBtnText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '700' },
  typeBtnTextActive: { color: Colors.bgDark },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 99, borderWidth: 1.5, borderColor: Colors.borderLight },
  catChipActive: { backgroundColor: Colors.bgDark, borderColor: Colors.bgDark },
  catChipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  catChipTextActive: { color: Colors.accentNeon },
  textarea: {
    backgroundColor: Colors.bgCardLight, borderWidth: 1, borderColor: Colors.borderLight,
    borderRadius: 12, padding: 14, fontSize: 14, color: Colors.textPrimary, minHeight: 110, lineHeight: 20,
  },
  photoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12,
    borderWidth: 1.5, borderColor: Colors.borderLight, borderRadius: 10, marginTop: 10, borderStyle: 'dashed',
  },
  photoBtnText: { fontSize: 13, color: Colors.accentTeal, fontWeight: '600' },
  selfHelpNote: {
    flexDirection: 'row', gap: 10, backgroundColor: 'rgba(0,207,255,0.07)', padding: 12, borderRadius: 10, marginTop: 12,
    borderWidth: 1, borderColor: 'rgba(0,207,255,0.15)', alignItems: 'flex-start',
  },
  selfHelpText: { flex: 1, fontSize: 12, color: Colors.accentNeon, lineHeight: 18 },
  submitBtn: { marginTop: 24 },
  successTitle: { fontSize: 24, color: Colors.textWhite, fontWeight: '900', marginTop: 16 },
  successRef: { fontSize: 14, color: Colors.accentNeon, fontWeight: '700', marginTop: 8, letterSpacing: 1 },
  successBody: { fontSize: 14, color: Colors.textOff, textAlign: 'center', lineHeight: 22, marginTop: 12, marginBottom: 32 },
  viewBtn: { width: '100%', marginBottom: 10 },
  homeBtn: { width: '100%' },
});
