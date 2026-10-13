/**
 * One inbox row.
 *
 * TODO (core):
 *  - Mail-style layout: unread dot, initials avatar, sender (bold when unread)
 *    + relative time on line 1, subject on line 2, preview clipped to 2 lines.
 *  - Fixed height (export the constant so the list can use exact item layouts).
 *  - Swipe left  -> Archive + Trash; full swipe commits Trash.
 *  - Swipe right -> Read/Unread toggle; full swipe commits.
 *  - Only one row open at a time; collapse animation on removal; revert on failure.
 *  - Accessible fallback so the actions are reachable without a swipe.
 *  - Keep re-renders scoped: changing one row must not re-render the list.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Email } from '../types/email';

export const ROW_HEIGHT = 92;

type Props = {
  email: Email;
  onPress: (email: Email) => void;
};

function EmailRow({ email, onPress }: Props): React.JSX.Element {
  return (
    <Pressable
      onPress={() => onPress(email)}
      style={styles.row}
      accessibilityRole="button"
      accessibilityLabel={`${email.isRead ? '' : 'Unread. '}From ${email.sender}. ${email.subject}`}
    >
      <View style={styles.text}>
        <Text style={[styles.sender, !email.isRead && styles.unread]} numberOfLines={1}>
          {email.sender}
        </Text>
        <Text style={styles.subject} numberOfLines={1}>
          {email.subject}
        </Text>
        <Text style={styles.preview} numberOfLines={2}>
          {email.preview}
        </Text>
      </View>
    </Pressable>
  );
}

export default React.memo(EmailRow);

const styles = StyleSheet.create({
  row: { height: ROW_HEIGHT, paddingHorizontal: 16, paddingVertical: 10, justifyContent: 'center' },
  text: { flex: 1 },
  sender: { fontSize: 16 },
  unread: { fontWeight: '700' },
  subject: { fontSize: 15, marginTop: 2 },
  preview: { fontSize: 14, opacity: 0.6, marginTop: 2 },
});
