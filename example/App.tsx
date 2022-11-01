import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import Card from './components/Card';

export default function App() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-400">
      <Card />
      <Card />
      <StatusBar style="auto" />
    </View>
  );
}
