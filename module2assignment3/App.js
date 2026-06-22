import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Task from './components/task';

export default function App() {
  return (
    <View style={styles.container}>
     <view style={styles.tasksWrapper}>
      <Text style={styles.sectionTitle}> Today's tasks</Text>



      <View style={styles.items}>
        {/* this is where the tasks will go*/}
      </View>
     </view>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop:30,
  },
});
