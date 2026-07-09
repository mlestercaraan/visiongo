import { View } from 'react-native';
import { Colors, Layout } from '../../constants/theme';

export function AccentStripe() {
  return (
    <View style={{ height: Layout.accentStripeHeight, backgroundColor: Colors.accentNeon, width: '100%' }} />
  );
}
