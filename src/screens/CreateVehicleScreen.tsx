import { Alert } from 'react-native';
import VehicleForm, { VehicleFormValues } from '../components/VehicleForm';
import { api } from '../services/api';
import { theme } from '../theme';
import { Vehicle } from '../types/Vehicles';

export default function CreateVehicleScreen() {
  async function createVehicle(values: VehicleFormValues) {
    const vehicleData = {
      plate: values.plate,
      brand: values.brand,
      model: values.model,
      year: Number(values.year),
      color: values.color,
    };

    try {
      await api.post<Vehicle>('/vehicles', vehicleData);
      Alert.alert('Cadastro realizado!', 'O veículo foi cadastrado com sucesso.');
    } catch (error) {
      console.error('Erro ao cadastrar veículo:', error);
      throw error;
    }
  }

  return (
    <VehicleForm
      initialValues={{ plate: '', brand: '', model: '', year: '', color: '' }}
      title="Cadastrar novo veículo"
      subtitle="Preencha os dados do veículo abaixo."
      submitLabel="Salvar veículo"
      submitColor={theme.colors.createAction}
      errorMessage="Não foi possível cadastrar o veículo. Verifique a conexão com a API e tente novamente."
      onSubmit={createVehicle}
    />
  );
}