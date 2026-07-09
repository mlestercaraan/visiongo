import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AccentStripe } from '../../components/ui/AccentStripe';
import { SignalMeter } from '../../components/ui/SignalMeter';
import { Colors, Layout } from '../../constants/theme';
import { DEMO_DEVICE } from '../../lib/mockData';

const STATUS_PLAIN: Record<string, { text: string; color: string; icon: string }> = {
  online: { text: 'Your connection is working normally', color: Colors.success, icon: 'checkmark-circle' },
  issue: { text: 'We detected an issue with your router', color: Colors.warning, icon: 'warning' },
  offline: { text: 'Your router appears to be offline', color: Colors.error, icon: 'cloud-offline' },
  unknown: { text: 'Checking your router status...', color: Colors.textMuted, icon: 'help-circle' },
};

function formatDate(dateStr?: string) {
  if (!dateStr) return 'Unknown';
  return new Date(dateStr).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function DeviceScreen() {
  const { deviceStatus, updateDeviceStatus } = useAppStore();
  const device = deviceStatus ?? DEMO_DEVICE;
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const [restartDone, setRestartDone] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [expanded, setExpanded] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const statusInfo = STATUS_PLAIN[device.cpe_status] ?? STATUS_PLAIN.unknown;

  const handleRestart = () => {
    setConfirmVisible(false);
    setRestarting(true);
    setSecondsLeft(120);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setRestarting(false);
          setRestartDone(true);
          updateDeviceStatus({ ...device, cpe_status: 'online', signal_quality: 'good' });
          return 0;
        }
        return prev - 1;
      });
    }, 50);
  };

  const troubleshootItems = [
    { title: 'No internet at all', steps: ['Check CPE status above - is it Online?', 'Try the Restart Router button', 'Check physical cable connections at the back of the router'] },
    { title: 'Internet is slow', steps: ['Check signal quality above', 'Check how many devices are connected', 'Try restarting the router', 'Consider upgrading your plan for faster speeds'] },
    { title: 'Wi-Fi connects but no internet', steps: ['Check if the fiber connection indicator is active', 'Ask neighbors if they have the same issue (area outage?)', 'Restart the router and wait 2 minutes'] },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AccentStripe />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Router Status</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Ionicons name="hardware-chip-outline" size={72} color={statusInfo.color} />
          <Ionicons name={statusInfo.icon as any} size={28} color={statusInfo.color} style={styles.statusIcon} />
          {restartDone ? (
            <Text style={[styles.statusText, { color: Colors.success }]}>Your connection has been restored!</Text>
          ) : restarting ? (
            <>
              <Text style={[styles.statusText, { color: Colors.warning }]}>Restarting your router...</Text>
              <Text style={styles.restartTimer}>This takes about {secondsLeft} seconds</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${((120 - secondsLeft) / 120) * 100}%` }]} />
              </View>
            </>
          ) : (
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
          )}
          <Text style={styles.lastUpdated}>Updated just now</Text>
        </View>

        {/* Device info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Information</Text>
          <View style={styles.infoCard}>
            {[
              { label: 'Model', value: device.device_model ?? 'Unknown' },
              { label: 'Serial Number', value: device.serial_number ?? 'Unknown' },
              { label: 'Installed', value: formatDate(device.installation_date) },
              { label: 'Firmware', value: device.firmware_version ?? 'Unknown' },
            ].map((item) => (
              <View key={item.label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Signal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Signal Quality</Text>
          <View style={styles.signalCard}>
            <SignalMeter quality={device.signal_quality ?? 'none'} />
          </View>
        </View>

        {/* Restart button */}
        {!restarting && !restartDone && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.restartBtn, device.cpe_status === 'online' && styles.restartBtnOnline]}
              onPress={() => setConfirmVisible(true)}
            >
              <Ionicons name="refresh" size={20} color={device.cpe_status === 'online' ? Colors.textMuted : Colors.bgDark} />
              <Text style={[styles.restartBtnText, device.cpe_status === 'online' && styles.restartBtnTextOnline]}>
                Restart Router
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Troubleshoot */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Troubleshooting Guide</Text>
          {troubleshootItems.map((item, i) => (
            <View key={i} style={styles.accordionItem}>
              <TouchableOpacity style={styles.accordionHeader} onPress={() => setExpanded(expanded === i ? null : i)}>
                <Text style={styles.accordionTitle}>{item.title}</Text>
                <Ionicons name={expanded === i ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
              {expanded === i && (
                <View style={styles.accordionBody}>
                  {item.steps.map((step, j) => (
                    <View key={j} style={styles.stepRow}>
                      <Text style={styles.stepNum}>{j + 1}</Text>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.helpBtn} onPress={() => router.push('/ticket/new')}>
          <Text style={styles.helpBtnText}>Still having trouble? File a support ticket</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.accentNeon} />
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Confirm modal */}
      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="refresh-circle" size={40} color={Colors.warning} style={{ marginBottom: 12 }} />
            <Text style={styles.modalTitle}>Restart Router?</Text>
            <Text style={styles.modalBody}>This will restart your router. Your connection will be unavailable for about 2 minutes.</Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setConfirmVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleRestart}>
                <Text style={styles.modalConfirmText}>Restart Now</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Layout.screenPadding, paddingVertical: 12, backgroundColor: Colors.bgDark, gap: 12 },
  back: { padding: 4 },
  headerTitle: { fontSize: 18, color: Colors.textWhite, fontWeight: '800' },
  scroll: { flex: 1, backgroundColor: Colors.bgDark },
  hero: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: Layout.screenPadding, position: 'relative' },
  statusIcon: { position: 'absolute', top: 32, right: '50%', marginRight: -48 },
  statusText: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginTop: 16, maxWidth: 280 },
  restartTimer: { fontSize: 14, color: Colors.textDim, marginTop: 8 },
  lastUpdated: { fontSize: 11, color: Colors.textDim, marginTop: 8 },
  progressBar: { width: 200, height: 4, backgroundColor: Colors.borderDark, borderRadius: 2, marginTop: 12 },
  progressFill: { height: 4, backgroundColor: Colors.warning, borderRadius: 2 },
  section: { paddingHorizontal: Layout.screenPadding, marginBottom: 12 },
  sectionTitle: { fontSize: 14, color: Colors.textOff, fontWeight: '700', letterSpacing: 0.5, marginBottom: 10 },
  infoCard: { backgroundColor: Colors.bgCardDark, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.borderDark },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderDark },
  infoLabel: { fontSize: 12, color: Colors.textDim },
  infoValue: { fontSize: 13, color: Colors.textWhite, fontWeight: '600' },
  signalCard: { backgroundColor: Colors.bgCardDark, borderRadius: 14, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: Colors.borderDark },
  restartBtn: { backgroundColor: Colors.warning, borderRadius: 12, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  restartBtnOnline: { backgroundColor: Colors.bgCardDark },
  restartBtnText: { fontSize: 16, fontWeight: '700', color: Colors.bgDark },
  restartBtnTextOnline: { color: Colors.textMuted },
  accordionItem: { backgroundColor: Colors.bgCardDark, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: Colors.borderDark, overflow: 'hidden' },
  accordionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  accordionTitle: { fontSize: 13, color: Colors.textOff, fontWeight: '600', flex: 1 },
  accordionBody: { padding: 14, paddingTop: 0 },
  stepRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  stepNum: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.accentNeon, color: Colors.bgDark, fontSize: 11, fontWeight: '900', textAlign: 'center', lineHeight: 20 },
  stepText: { flex: 1, fontSize: 13, color: Colors.textDim, lineHeight: 18 },
  helpBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, marginHorizontal: Layout.screenPadding },
  helpBtnText: { fontSize: 14, color: Colors.accentNeon, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: Colors.bgCardLight, borderRadius: 20, padding: 24, width: '100%', alignItems: 'center' },
  modalTitle: { fontSize: 18, color: Colors.textPrimary, fontWeight: '800', marginBottom: 10 },
  modalBody: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  modalBtns: { flexDirection: 'row', gap: 12, width: '100%' },
  modalCancel: { flex: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.borderLight },
  modalCancelText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '700' },
  modalConfirm: { flex: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center', backgroundColor: Colors.warning },
  modalConfirmText: { fontSize: 15, color: Colors.bgDark, fontWeight: '700' },
});
