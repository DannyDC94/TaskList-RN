import { SafeAreaView, StyleSheet } from 'react-native';
import Routes from './src/routes';
import { PaperProvider } from 'react-native-paper';

function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <Routes />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
