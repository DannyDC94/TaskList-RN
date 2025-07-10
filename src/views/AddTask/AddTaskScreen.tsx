import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAsyncStorage } from '../../hooks/useAsyncStorage';
import { useTasks } from '../../store/taskStore';
import { RootStackParams, Task } from '../../types';

type AddTaskScreenRouteProp = RouteProp<RootStackParams, 'AddTask'>;

const TASK = '@Task';

const AddTaskScreen = () => {
  const route = useRoute<AddTaskScreenRouteProp>();
  const { task, mode } = route.params || {};
  const isEditing = mode === 'edit' && task;
  const { addTask, updateTask } = useTasks();

  const initialValues: Task = isEditing
    ? task
    : {
        id: '',
        name: '',
        description: '',
        status: 'pending',
        createdAt: '',
      };
  const [formData, setFormData] = useState<Task>(initialValues);
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
      addTask({
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status.trim() || 'pending',
      });
      Alert.alert('Éxito', 'Tarea guardada correctamente', [
        {
          text: 'OK',
          onPress: () => {
            setFormData(initialValues);
            goBack();
          },
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    }
  };

  const editTask = async () => {
    try {
      updateTask(task!.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status.trim() || 'pending',
      });
      Alert.alert('Éxito', 'Tarea actualizada correctamente', [
        {
          text: 'OK',
          onPress: () => {
            setFormData(initialValues);
            goBack();
          },
        },
      ]);
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
