import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View, } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  const [deleting, setDeleting] = useState(false);
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

  async function deleteVehicle() {
    try {
      setDeleting(true);
      await api.delete(`/vehicles/${vehicleId}`);
      navigation.goBack();
      Alert.alert('Veículo excluído', 'O veículo foi removido com sucesso.');
    } catch (requestError) {
      console.error('Erro ao excluir veículo:', requestError);
      Alert.alert(
        'Não foi possível excluir',
        'O veículo não foi removido. Verifique a conexão com a API e tente novamente.',
      );
    } finally {
      setDeleting(false);
    }
  }

  function confirmDelete() {
    Alert.alert(
      'Excluir veículo?',
      `Deseja realmente excluir ${vehicle?.brand} ${vehicle?.model}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            void deleteVehicle();
          },
        },
      ],
    );
  }

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
        <Pressable style={styles.actionButton} onPress={loadVehicle} accessibilityRole="button">
          <MaterialCommunityIcons name="refresh" size={20} color={theme.colors.surface} />
          <Text style={styles.actionButtonText}>Tentar novamente</Text>
        </Pressable>
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
      <Pressable
        style={[styles.actionButton, deleting && styles.disabledButton]}
        disabled={deleting}
        onPress={() => navigation.navigate('EditVehicle', { vehicleId })}
        accessibilityRole="button"
        accessibilityLabel="Editar veículo"
      >
        <MaterialCommunityIcons name="pencil" size={20} color={theme.colors.surface} />
        <Text style={styles.actionButtonText}>Editar veículo</Text>
      </Pressable>
      <View style={styles.buttonSpacing}>
        {deleting ? (
          <View style={styles.deleting}>
            <ActivityIndicator color={theme.colors.danger} />
            <Text style={styles.secondaryText}>Excluindo veículo...</Text>
          </View>
        ) : (
          <Pressable
            style={[styles.actionButton, styles.deleteButton]}
            onPress={confirmDelete}
            accessibilityRole="button"
            accessibilityLabel="Excluir veículo"
          >
            <MaterialCommunityIcons name="trash-can-outline" size={20} color={theme.colors.surface} />
            <Text style={styles.actionButtonText}>Excluir veículo</Text>
          </Pressable>
        )}
      </View>
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
  buttonSpacing: {
    marginTop: theme.spacing.sm,
  },
  actionButton: {
    minHeight: 46,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
  },
  deleteButton: {
    backgroundColor: theme.colors.danger,
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: '700',
  },
  deleting: {
    minHeight: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
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