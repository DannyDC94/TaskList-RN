import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../views/Home';
import AddTaskScreen from '../views/AddTask';
import { RootStackParams } from '../types';

const Stack = createNativeStackNavigator<RootStackParams>();

const Routes = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Lista de Tareas' }}
      ></Stack.Screen>
      <Stack.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{ title: 'Nueva Tarea' }}
      ></Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
);

export default Routes;
