import { SafeAreaView, StyleSheet } from 'react-native';
import Routes from './src/routes';
import { PaperProvider } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/config/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <Routes />
        </SafeAreaView>
      </PaperProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
