import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from './types';

import VehicleListScreen from '../screens/VehicleListScreen';
import VehicleDetailsScreen from '../screens/VehicleDetailsScreen';
import CreateVehicleScreen from '../screens/CreateVehicleScreen';
import EditVehicleScreen from '../screens/EditVehicleScreen';
import { theme } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
        }}
      >
        <Stack.Screen
          name="VehicleList"
          component={VehicleListScreen}
          options={{
            title: 'NinjaCar',
            headerTitle: () => (
              <View style={styles.headerTitle}>
                <Image
                  source={require('../../assets/ninja.png')}
                  style={styles.headerLogo}
                  resizeMode="contain"
                  accessibilityLabel="Logo NinjaCar"
                />
                <Text style={styles.headerText}>
                  Ninja<Text style={styles.headerAccent}>Car</Text>
                </Text>
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="VehicleDetails"
          component={VehicleDetailsScreen}
          options={{ title: 'Detalhes do veículo' }}
        />

        <Stack.Screen
          name="CreateVehicle"
          component={CreateVehicleScreen}
          options={{ title: 'Novo Carro' }}
        />

        <Stack.Screen
          name="EditVehicle"
          component={EditVehicleScreen}
          options={{ title: 'Editar' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerLogo: {
    width: 34,
    height: 34,
  },
  headerText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  headerAccent: {
    color: theme.colors.logoAccent,
  },
});