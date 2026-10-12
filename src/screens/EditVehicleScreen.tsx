import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import VehicleForm, { VehicleFormValues } from '../components/VehicleForm';
import { RootStackParamList } from '../navigation/types';
import { api } from '../services/api';
import { theme } from '../theme';
import { Vehicle } from '../types/Vehicles';

type Props = NativeStackScreenProps<RootStackParamList, 'EditVehicle'>;

export default function EditVehicleScreen({ navigation, route }: Props) {
  const { vehicleId } = route.params;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadVehicle = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get<Vehicle>(`/vehicles/${vehicleId}`);
      setVehicle(response.data);
    } catch (requestError) {
      console.error('Erro ao carregar veículo para edição:', requestError);
      setError('Não foi possível carregar o veículo para edição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    loadVehicle();
  }, [loadVehicle]);

  async function updateVehicle(values: VehicleFormValues) {
    const vehicleData: Vehicle = {
      id: vehicleId,
      plate: values.plate,
      brand: values.brand,
      model: values.model,
      year: Number(values.year),
      color: values.color,
    };

    try {
      await api.put<Vehicle>(`/vehicles/${vehicleId}`, vehicleData);
      Alert.alert('Alterações salvas', 'O veículo foi atualizado com sucesso.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (requestError) {
      console.error('Erro ao atualizar veículo:', requestError);
      throw requestError;
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.secondaryText}>Carregando dados para edição...</Text>
      </View>
    );
  }

  if (error || !vehicle) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error || 'Veículo não encontrado.'}</Text>
        <Button title="Tentar novamente" onPress={loadVehicle} />
      </View>
    );
  }

  return (
    <VehicleForm
      initialValues={{
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        year: String(vehicle.year),
        color: vehicle.color,
      }}
      title="Editar veículo"
      subtitle="Atualize os dados do veículo abaixo."
      submitLabel="Salvar alterações"
      submitColor={theme.colors.editAction}
      errorMessage="Não foi possível atualizar o veículo. Verifique a conexão com a API e tente novamente."
      onSubmit={updateVehicle}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  secondaryText: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  error: {
    color: theme.colors.danger,
    marginBottom: theme.spacing.md,
  },
});