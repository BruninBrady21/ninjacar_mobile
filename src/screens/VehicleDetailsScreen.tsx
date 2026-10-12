import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Button, StyleSheet, Text, View, } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { api } from '../services/api';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';
import { Vehicle } from '../types/Vehicles';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleDetails'>;

export default function VehicleDetailsScreen({ navigation, route }: Props) {
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
      console.error('Erro ao carregar veículo:', requestError);
      setError('Não foi possível carregar os dados do veículo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useFocusEffect(
    useCallback(() => {
      loadVehicle();
    }, [loadVehicle]),
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.secondaryText}>Carregando veículo...</Text>
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
    <View style={styles.container}>
      <Text style={styles.title}>{vehicle.brand} {vehicle.model}</Text>
      <View style={styles.card}>
        <Detail label="Placa" value={vehicle.plate} />
        <Detail label="Marca" value={vehicle.brand} />
        <Detail label="Modelo" value={vehicle.model} />
        <Detail label="Ano" value={String(vehicle.year)} />
        <Detail label="Cor" value={vehicle.color} />
      </View>
      <Button
        title="Editar veículo"
        color={theme.colors.primary}
        onPress={() => navigation.navigate('EditVehicle', { vehicleId })}
      />
    </View>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  label: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
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