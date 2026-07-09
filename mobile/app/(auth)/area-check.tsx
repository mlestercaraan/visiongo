import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Colors, Spacing, Radius } from '../../constants/theme';

const SERVICEABLE = ['lipa', 'batangas', 'san jose', 'tanauan', 'nasugbu', 'lemery'];

type ResultState = null | 'served' | 'not-served' | 'notify-sent';

export default function AreaCheckScreen() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ResultState>(null);
  const [matchedArea, setMatchedArea] = useState('');
  const [notifyName, setNotifyName] = useState('');
  const [notifyMobile, setNotifyMobile] = useState('');

  function handleCheck() {
    const lower = query.toLowerCase().trim();
    const match = SERVICEABLE.find((area) => lower.includes(area));
    if (match) {
      setMatchedArea(match.charAt(0).toUpperCase() + match.slice(1));
      setResult('served');
    } else {
      setMatchedArea(query.trim() || 'your area');
      setResult('not-served');
    }
  }

  function handleNotify() {
    setResult('notify-sent');
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.title}>Check your area</Text>
        <Text style={styles.subtitle}>
          Find out if Asian Vision internet is available near you.
        </Text>

        {result === null || result === 'not-served' ? (
          <>
            <TextInput
              style={styles.input}
              value={query}
              onChangeText={(v) => { setQuery(v); setResult(null); }}
              placeholder="e.g. Lipa, Batangas City, San Jose"
              placeholderTextColor={Colors.textMuted}
            />
            <Button
              title="Check Availability"
              variant="primary"
              size="lg"
              style={styles.btnFull}
              disabled={!query.trim()}
              onPress={handleCheck}
            />
          </>
        ) : null}

        {result === 'served' && (
          <Card style={styles.resultCard}>
            <View style={styles.resultRow}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={22} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.resultTitle}>Great news!</Text>
                <Text style={styles.resultBody}>
                  Asian Vision is available in{' '}
                  <Text style={{ fontWeight: '700' }}>{matchedArea}</Text>.
                </Text>
              </View>
            </View>

            <Text style={styles.plansLabel}>Available plans:</Text>
            <View style={styles.planRow}>
              <View style={styles.planItem}>
                <Text style={styles.planName}>Fiber 50</Text>
                <Text style={styles.planPrice}>PHP 1,299 / mo</Text>
              </View>
              <View style={styles.planItem}>
                <Text style={styles.planName}>Fiber 100</Text>
                <Text style={styles.planPrice}>PHP 1,799 / mo</Text>
              </View>
            </View>

            <Button
              title="Apply Now"
              variant="primary"
              size="lg"
              style={styles.btnFull}
              onPress={() => router.push('/(auth)/apply')}
            />
          </Card>
        )}

        {result === 'not-served' && (
          <Card style={styles.notYetCard}>
            <Text style={styles.notYetTitle}>
              We're not in {matchedArea} yet, but we're growing!
            </Text>
            <Text style={styles.notYetBody}>
              Leave your details and we'll notify you when service becomes available.
            </Text>

            <TextInput
              style={styles.input}
              value={notifyName}
              onChangeText={setNotifyName}
              placeholder="Your name"
              placeholderTextColor={Colors.textMuted}
            />
            <TextInput
              style={styles.input}
              value={notifyMobile}
              onChangeText={setNotifyMobile}
              placeholder="Mobile number"
              keyboardType="numeric"
              placeholderTextColor={Colors.textMuted}
            />
            <Button
              title="Notify Me"
              variant="primary"
              size="lg"
              style={styles.btnFull}
              disabled={!notifyName.trim() || !notifyMobile.trim()}
              onPress={handleNotify}
            />
          </Card>
        )}

        {result === 'notify-sent' && (
          <Card style={styles.successCard}>
            <View style={styles.successRow}>
              <Ionicons name="checkmark-circle" size={36} color={Colors.success} />
              <View style={{ flex: 1 }}>
                <Text style={styles.successTitle}>You're on the list!</Text>
                <Text style={styles.successBody}>
                  We'll text you as soon as Asian Vision arrives in your area.
                </Text>
              </View>
            </View>
          </Card>
        )}
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
    gap: Spacing.md,
  },
  backBtn: {
    paddingVertical: Spacing.md,
    paddingHorizontal: 0,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    color: Colors.textPrimary,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  btnFull: {
    width: '100%',
  },
  resultCard: {
    gap: Spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  checkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  resultBody: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  plansLabel: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  planRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  planItem: {
    flex: 1,
    backgroundColor: Colors.bgLight,
    borderRadius: Radius.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  planName: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  planPrice: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  notYetCard: {
    gap: Spacing.sm,
  },
  notYetTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  notYetBody: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  successCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  successTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  successBody: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
});
