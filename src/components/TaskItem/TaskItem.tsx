import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useTasks } from '../../store/taskStore';
import { RootStackParams, Task } from '../../types';

type TaskItemProps = {
  task: Task;
};

type AddTaskScreenNavigationProp = NativeStackNavigationProp<
  RootStackParams,
  'AddTask'
>;

const TaskItem = ({ task }: TaskItemProps) => {
  const { name, status } = task;
  const { navigate } = useNavigation<AddTaskScreenNavigationProp>();
  const { deleteTask } = useTasks();

  const handleEdit = (task: Task) => {
    navigate('AddTask', {
      task: task,
      mode: 'edit',
    });
  };

  const handleDeleteWithConfirmation = async (id: Task['id']) => {
    // Mostrar confirmación antes de eliminar
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              deleteTask(id);
              Alert.alert('Éxito', 'Tarea eliminada correctamente');
            } catch (error) {
              console.error('Error al eliminar tarea:', error);
              Alert.alert('Error', 'Ocurrió un error inesperado');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.status}>{status}</Text>
      </View>
      <View style={styles.actions}>
        <IconButton
          icon="pencil-outline"
          iconColor="#0081f1"
          size={20}
          onPress={() => handleEdit(task)}
        />
        <IconButton
          icon="trash-can-outline"
          iconColor="#FF0000"
          size={20}
          onPress={() => handleDeleteWithConfirmation(task.id)}
        />
      </View>
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#fff',
  },
  content: {
    flex: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 500,
  },
  status: {
    fontSize: 14,
    color: '#808080',
  },
  actions: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
});

export default TaskItem;
