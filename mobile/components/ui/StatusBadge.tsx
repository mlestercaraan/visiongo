import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

type StatusType = 'active' | 'suspended' | 'disconnected' | 'pending' | 'online' | 'offline' | 'issue' | 'unknown' | 'paid' | 'unpaid' | 'overdue' | 'partial' | 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled' | 'invited' | 'registered' | 'activated';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: 'Active', bg: Colors.success, text: '#fff' },
  suspended: { label: 'Suspended', bg: Colors.warning, text: Colors.bgDark },
  disconnected: { label: 'Disconnected', bg: Colors.error, text: '#fff' },
  pending: { label: 'Pending', bg: Colors.textMuted, text: '#fff' },
  online: { label: 'Online', bg: Colors.success, text: '#fff' },
  offline: { label: 'Offline', bg: Colors.error, text: '#fff' },
  issue: { label: 'Issue', bg: Colors.warning, text: Colors.bgDark },
  unknown: { label: 'Unknown', bg: Colors.textMuted, text: '#fff' },
  paid: { label: 'Paid', bg: Colors.success, text: '#fff' },
  unpaid: { label: 'Unpaid', bg: Colors.warning, text: Colors.bgDark },
  overdue: { label: 'Overdue', bg: Colors.error, text: '#fff' },
  partial: { label: 'Partial', bg: Colors.accentTeal, text: '#fff' },
  open: { label: 'Open', bg: Colors.accentBlue, text: '#fff' },
  in_progress: { label: 'In Progress', bg: Colors.warning, text: Colors.bgDark },
  resolved: { label: 'Resolved', bg: Colors.success, text: '#fff' },
  closed: { label: 'Closed', bg: Colors.textMuted, text: '#fff' },
  cancelled: { label: 'Cancelled', bg: Colors.textMuted, text: '#fff' },
  invited: { label: 'Invited', bg: Colors.accentBlue, text: '#fff' },
  registered: { label: 'Registered', bg: Colors.warning, text: Colors.bgDark },
  activated: { label: 'Activated', bg: Colors.success, text: '#fff' },
};

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.unknown;
  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, isSmall && styles.badgeSm]}>
      <Text style={[styles.text, { color: config.text }, isSmall && styles.textSm]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
  textSm: {
    fontSize: 10,
  },
});
