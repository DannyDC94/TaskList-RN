import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { statusOptions } from '../../constants/statusOptions';
import { TaskFormData, taskSchema } from '../../schema/taskSchema';
import { useTasks } from '../../store/taskStore';
import { RootStackParams } from '../../types';

type AddTaskScreenRouteProp = RouteProp<RootStackParams, 'AddTask'>;

const AddTaskScreen = () => {
  const route = useRoute<AddTaskScreenRouteProp>();
  const { task, mode } = route.params || {};
  const isEditing = mode === 'edit' && task;
  const { addTask, updateTask } = useTasks();
  const { goBack } = useNavigation();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'pending',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isEditing && task) {
      setValue('name', task.name);
      setValue('description', task.description);
      setValue('status', task.status);
    } else {
      reset({
        name: '',
        description: '',
        status: 'pending',
      });
    }
  }, [isEditing, task, setValue, reset]);

  const onSubmit = (data: TaskFormData) => {
    try {
      if (isEditing) {
        updateTask(task!.id, {
          name: data.name.trim(),
          description: data.description!.trim(),
          status: data.status || 'pending',
        });
      } else {
        addTask({
          name: data.name.trim(),
          description: data.description!.trim(),
          status: data.status || 'pending',
        });
      }
      const textAlert = isEditing
        ? 'Tarea actualizada correctamente'
        : 'Tarea creada correctamente';
      Alert.alert('Éxito', textAlert, [
        {
          text: 'OK',
          onPress: () => {
            reset();
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
          <Text style={styles.textLabel}>Nombre:</Text>
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'El nombre es obligatorio',
              minLength: {
                value: 3,
                message: 'Mínimo 3 caracteres',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Ingrese el nombre de la tarea..."
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textLabel}>Descripción:</Text>
          <Controller
            control={control}
            name="description"
            rules={{
              maxLength: {
                value: 200,
                message: 'Máximo 200 caracteres',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors.description && styles.inputError,
                ]}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Describe la tarea (opcional)..."
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            )}
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description.message}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textLabel}>Estado:</Text>
          <Controller
            control={control}
            name="status"
            render={({ field: { onChange, value } }) => (
              <View style={styles.statusContainer}>
                {statusOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.statusOption,
                      value === option.value && styles.statusOptionSelected,
                    ]}
                    onPress={() => onChange(option.value)}
                  >
                    <Text
                      style={[
                        styles.statusOptionText,
                        value === option.value &&
                          styles.statusOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>
        <View style={styles.button}>
          <Button title="Guardar" onPress={handleSubmit(onSubmit)}></Button>
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
    fontWeight: 'bold',
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
  inputError: {
    borderColor: '#ff6b6b',
  },
  textLabel: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  statusOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  statusOptionText: {
    fontSize: 14,
    color: '#333',
  },
  statusOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AddTaskScreen;
