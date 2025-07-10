import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams, Task } from '../../types';
import { useAsyncStorage } from '../../hooks/useAsyncStorage';
import TaskItem from '../../components/TaskItem';

type NavigationProp = NativeStackNavigationProp<RootStackParams>;

const TASK = '@Task';

const HomeScreen = () => {
  const [tasks, setTask] = useState<Task[]>();
  const { navigate } = useNavigation<NavigationProp>();
  const { getAsyncStorage } = useAsyncStorage();

  const loadTasks = useCallback(async () => {
    try {
      const storeTasks = (await getAsyncStorage<Task[]>(TASK)) || [];
      setTask(storeTasks);
    } catch (error) {
      setTask([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks().catch();
    }, [loadTasks]),
  );

  const handleNewTask = () => {
    navigate('AddTask');
  };

  return (
    <View style={styles.container}>
      <Button title="Nueva tarea" onPress={handleNewTask}></Button>
      <FlatList
        style={styles.listTask}
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TaskItem task={item} onCompleteRemove={() => loadTasks()} />}
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
