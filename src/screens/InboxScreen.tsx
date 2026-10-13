/**
 * Inbox list.
 *
 * TODO (core):
 *  - Load pages with fetchInbox() and append as the user nears the end.
 *  - Pull-to-refresh: reload from page 1 and discard cached pages.
 *  - Loading, inline error-with-retry (footer, not full screen), and empty states.
 *  - Render each message with <EmailRow />, fixed row height.
 *  - Open a message on tap; mark it read; restore the scroll offset on return.
 *  - Swipe actions: see the exercise document and EmailRow.tsx.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function InboxScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inbox</Text>
      <Text style={styles.hint}>Replace this placeholder with the message list.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  hint: { fontSize: 15, opacity: 0.6, textAlign: 'center' },
});
