import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAsyncStorage } from '../../hooks/useAsyncStorage';
import { RootStackParams, Task } from '../../types';
import { generateId } from '../../utils/generateId';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

type AddTaskScreenRouteProp = RouteProp<RootStackParams, 'AddTask'>;

const TASK = '@Task';

const AddTaskScreen = () => {
  const route = useRoute<AddTaskScreenRouteProp>();
  const { task, mode } = route.params || {};
  const isEditing = mode === 'edit' && task;

  const initialValues: Task = isEditing
    ? task
    : {
        id: '',
        name: '',
        description: '',
        status: '',
        createdAt: '',
      };
  const [formData, setFormData] = useState<Task>(initialValues);
  const { getAsyncStorage, setAsyncStorage } = useAsyncStorage();
  const { goBack } = useNavigation();

  const onChangeValues = (field: keyof Task) => (text: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: text,
    }));
  };

  const handleSubmit = () => (isEditing ? editTask() : createTask());

  const createTask = async () => {
    try {
      const storeTasks = (await getAsyncStorage<Task[]>(TASK)) || [];
      const newTask: Task = {
        ...formData,
        id: generateId(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status.trim() || 'pendiente',
        createdAt: new Date().toISOString(),
      };

      const updatedTasks = [...storeTasks, newTask];
      const success = await setAsyncStorage<Task[]>(TASK, updatedTasks);
      if (success) {
        Alert.alert('Éxito', 'Tarea guardada correctamente', [
          {
            text: 'OK',
            onPress: () => {
              setFormData(initialValues);
              goBack();
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'No se pudo guardar la tarea');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    }
  };

  const editTask = async () => {
    try {
      const storeTasks = (await getAsyncStorage<Task[]>(TASK)) || [];
      const updateTask: Task = {
        ...task,
        ...formData,
      };

      const indexUpdate = storeTasks.findIndex(tk => tk.id === task!.id);
      if (indexUpdate === -1) {
        console.error('Tarea no encontrada');
        return false;
      }

      storeTasks[indexUpdate] = {
        ...storeTasks[indexUpdate],
        ...updateTask
      };

      const success = await setAsyncStorage<Task[]>(TASK, storeTasks);
      if (success) {
        Alert.alert('Éxito', 'Tarea actualizada correctamente', [
          {
            text: 'OK',
            onPress: () => {
              setFormData(initialValues);
              goBack();
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'No se pudo guardar la tarea');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear nueva tarea</Text>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text>Nombre:</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={onChangeValues('name')}
            placeholder="Ingrese el texto..."
          ></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Text>Descripción:</Text>
          <TextInput
            style={styles.input}
            value={formData.description}
            onChangeText={onChangeValues('description')}
            placeholder="Ingrese el texto..."
          ></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Text>Estado:</Text>
          <TextInput
            style={styles.input}
            value={formData.status}
            onChangeText={onChangeValues('status')}
            placeholder="Ingrese el texto..."
          ></TextInput>
        </View>
        <View style={styles.button}>
          <Button title="Guardar" onPress={handleSubmit}></Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  title: {
    fontSize: 16,
  },
  form: {
    marginVertical: 10,
  },
  inputContainer: {
    marginVertical: 5,
  },
  input: {
    borderColor: '#808080',
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
  },
  button: {
    marginVertical: 20,
  },
});

export default AddTaskScreen;
