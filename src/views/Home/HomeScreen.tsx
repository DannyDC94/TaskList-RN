import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, FlatList, StyleSheet, View } from 'react-native';
import TaskItem from '../../components/TaskItem';
import { useTasks } from '../../hooks/useTasksQuery';
import { RootStackParams } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParams>;

const HomeScreen = () => {
  const { navigate } = useNavigation<NavigationProp>();
  const { tasks } = useTasks();

  const handleNewTask = () => {
    navigate('AddTask');
  };

  console.log('Task Here', tasks);

  return (
    <View style={styles.container}>
      <Button title="Nueva tarea" onPress={handleNewTask}></Button>
      <FlatList
        style={styles.listTask}
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TaskItem task={item}/>}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
  },
  listTask: {
    marginTop: 15,
  },
});

export default HomeScreen;
