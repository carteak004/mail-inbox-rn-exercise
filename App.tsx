/**
 * App entry point.
 *
 * The starter intentionally has no navigation library. You will need to add
 * one (or roll your own) to move between InboxScreen and MessageScreen, and
 * the inbox must return to the same scroll offset when you come back.
 * Whatever you add, record it and the reason in MOBILE_NOTES.md.
 */
import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import InboxScreen from './src/screens/InboxScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.root}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <InboxScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;
