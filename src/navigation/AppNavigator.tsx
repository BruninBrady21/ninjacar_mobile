import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import VehicleListScreen from '../screens/VehicleListScreen';
import VehicleDetailsScreen from '../screens/VehicleDetailsScreen';
import CreateVehicleScreen from '../screens/CreateVehicleScreen';
import EditVehicleScreen from '../screens/EditVehicleScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="VehicleList"
          component={VehicleListScreen}
          options={{ title: 'NinjaCar' }}
        />

        <Stack.Screen
          name="VehicleDetails"
          component={VehicleDetailsScreen}
          options={{ title: 'Detalhes do veículo' }}
        />

        <Stack.Screen
          name="CreateVehicle"
          component={CreateVehicleScreen}
          options={{ title: 'Cadastrar veículo' }}
        />

        <Stack.Screen
          name="EditVehicle"
          component={EditVehicleScreen}
          options={{ title: 'Editar veículo' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}