import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'VehicleList'
>;

export default function VehicleListScreen({ navigation }: Props) {
  return (
    <View>
      <Text>NinjaCar - Veículos</Text>

      <Button
        title="Cadastrar veículo"
        onPress={() => navigation.navigate('CreateVehicle')}
      />

      <Button
        title="Detalhes do veículo"
        onPress={() => navigation.navigate('VehicleDetails')}
      />

      <Button
        title="Editar veículo"
        onPress={() => navigation.navigate('EditVehicle')}
      />
    </View>
  );
}