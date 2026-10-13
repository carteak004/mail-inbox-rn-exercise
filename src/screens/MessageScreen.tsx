/**
 * Single message view.
 *
 * TODO (core):
 *  - Show sender, sender email, subject, date and the full body.
 *  - Opening a message marks it read (setRead) and the inbox row must reflect
 *    that when the user navigates back.
 *  - Props/params are yours to define once you have chosen a navigation approach.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Email } from '../types/email';

type Props = {
  email: Email;
};

export default function MessageScreen({ email }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.subject}>{email.subject}</Text>
      <Text style={styles.meta}>
        {email.sender} · {email.senderEmail}
      </Text>
      <Text style={styles.body}>{email.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  subject: { fontSize: 20, fontWeight: '600', marginBottom: 6 },
  meta: { fontSize: 13, opacity: 0.6, marginBottom: 16 },
  body: { fontSize: 15, lineHeight: 22 },
});
