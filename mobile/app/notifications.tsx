import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { AccentStripe } from '../components/ui/AccentStripe';
import { Colors, Layout } from '../constants/theme';
import { DEMO_NOTIFICATIONS } from '../lib/mockData';

const TYPE_ICON: Record<string, { name: string; color: string }> = {
  billing: { name: 'card-outline', color: Colors.accentNeon },
  referral: { name: 'people-outline', color: Colors.pink },
  support: { name: 'headset-outline', color: Colors.warning },
  promo: { name: 'megaphone-outline', color: Colors.success },
};

function getRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

export default function NotificationsScreen() {
  const { setUnreadCount } = useAppStore();
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    const unread = notifications.filter((n) => !n.is_read && n.id !== id).length;
    setUnreadCount(unread);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AccentStripe />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markAll}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {notifications.map((notif) => {
          const iconConfig = TYPE_ICON[notif.type] ?? TYPE_ICON.promo;
          return (
            <TouchableOpacity key={notif.id} style={[styles.notifRow, !notif.is_read && styles.notifRowUnread]} onPress={() => markRead(notif.id)}>
              <View style={[styles.notifIcon, { backgroundColor: iconConfig.color + '18' }]}>
                <Ionicons name={iconConfig.name as any} size={20} color={iconConfig.color} />
              </View>
              <View style={styles.notifContent}>
                <Text style={[styles.notifTitle, !notif.is_read && styles.notifTitleUnread]}>{notif.title}</Text>
                <Text style={styles.notifBody} numberOfLines={2}>{notif.body}</Text>
                <Text style={styles.notifTime}>{getRelativeTime(notif.created_at)}</Text>
              </View>
              {!notif.is_read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bgDark },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Layout.screenPadding, paddingVertical: 12, gap: 12 },
  back: { padding: 4 },
  headerTitle: { fontSize: 18, color: Colors.textWhite, fontWeight: '800', flex: 1 },
  markAll: { fontSize: 13, color: Colors.accentNeon, fontWeight: '600' },
  scroll: { flex: 1, backgroundColor: Colors.bgLight },
  notifRow: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, backgroundColor: Colors.bgCardLight },
  notifRowUnread: { backgroundColor: 'rgba(0,207,255,0.04)' },
  notifIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0 },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600', marginBottom: 3 },
  notifTitleUnread: { color: Colors.textPrimary, fontWeight: '800' },
  notifBody: { fontSize: 13, color: Colors.textMuted, lineHeight: 19 },
  notifTime: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accentNeon, marginTop: 6, flexShrink: 0 },
});
