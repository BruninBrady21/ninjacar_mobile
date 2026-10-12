import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import axios from 'axios';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Vehicle } from '../types/Vehicles';
import { api } from '../services/api';
import { theme } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleList'>;

export default function VehicleListScreen({ navigation }: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  /*const loadVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get<Vehicle[]>('/vehicles');
      setVehicles(response.data);
    } catch (err) {
      console.error('Erro ao carregar veículos:', err);
      setError(
        'Não foi possível carregar os veículos. Verifique a conexão com a API.',
      );
    } finally {
      setLoading(false);
    }
  }, []);*/

  
const loadVehicles = useCallback(async () => {
  console.log('[DEBUG] loadVehicles iniciou');

  try {
    setLoading(true);
    setError('');

    console.log('[DEBUG] Chamando GET /vehicles');

    const response = await api.get<Vehicle[]>('/vehicles');

    console.log('[DEBUG] Resposta recebida:', response.status);
    console.log('[DEBUG] Dados:', response.data);

    setVehicles(response.data);
  } catch (err) {
    console.error('[DEBUG] Erro completo:', err);

    if (axios.isAxiosError(err)) {
      const details = [
        `Mensagem: ${err.message}`,
        `Código: ${err.code ?? 'não informado'}`,
        `URL: ${err.config?.baseURL}${err.config?.url}`,
        `Status HTTP: ${err.response?.status ?? 'sem resposta HTTP'}`,
      ].join('\n');

      console.log('[DEBUG] Detalhes Axios:', details);
      setError(details);
    } else {
      const message =
        err instanceof Error ? err.message : String(err);

      setError(`Erro não relacionado ao Axios: ${message}`);
    }
  } finally {
    setLoading(false);
  }
}, []);

  useFocusEffect(
    useCallback(() => {   
        loadVehicles();  
    }, 
    [loadVehicles]), );

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesBrand = vehicle.brand
      .toLowerCase()
      .includes(brandFilter.trim().toLowerCase());

    const matchesYear =
      yearFilter.trim() === '' ||
      String(vehicle.year).includes(yearFilter.trim());

    return matchesBrand && matchesYear;
  });

  function clearFilters() {
    setBrandFilter('');
    setYearFilter('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NinjaCar - Veículos</Text>

      <Button
        title="Cadastrar veículo"
        onPress={() => navigation.navigate('CreateVehicle')}
      />

      <View style={styles.buttonSpacing}>
        <Button
          title="Detalhes do veículo"
          onPress={() => navigation.navigate('VehicleDetails')}
        />
      </View>

      <View style={styles.buttonSpacing}>
        <Button
          title="Editar veículo"
          onPress={() => navigation.navigate('EditVehicle')}
        />
      </View>

      <Text style={styles.sectionTitle}>Filtros</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar por marca (ex.: Toyota)"
        value={brandFilter}
        onChangeText={setBrandFilter}
        autoCapitalize="words"
        accessibilityLabel="Filtrar veículos por marca"
      />

      <TextInput
        style={styles.input}
        placeholder="Filtrar por ano (ex.: 2023)"
        value={yearFilter}
        onChangeText={setYearFilter}
        keyboardType="numeric"
        accessibilityLabel="Filtrar veículos por ano"
      />

      <Button title="Limpar filtros" onPress={clearFilters} />

      <Text style={styles.sectionTitle}>Veículos cadastrados</Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : error ? (
        <View>
          <Text style={styles.error}>{error}</Text>
          <Button title="Tentar novamente" onPress={loadVehicles} />
        </View>
      ) : (
        <>
          <Text style={styles.resultCount}>
            {filteredVehicles.length}{' '}
            {filteredVehicles.length === 1
              ? 'veículo encontrado'
              : 'veículos encontrados'}
          </Text>

          <FlatList
            data={filteredVehicles}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyMessage}>
                {vehicles.length === 0
                  ? 'Nenhum veículo cadastrado.'
                  : 'Nenhum veículo corresponde aos filtros.'}
              </Text>
            }
            renderItem={({ item }) => (
              <View style={styles.vehicleCard}>
                <Text style={styles.vehicleTitle}>
                  {item.brand} {item.model}
                </Text>
                <Text>Placa: {item.plate}</Text>
                <Text>Ano: {item.year}</Text>
                <Text>Cor: {item.color}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  buttonSpacing: {
    marginTop: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  resultCount: {
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  list: {
    paddingBottom: theme.spacing.lg,
  },
  vehicleCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptyMessage: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  error: {
    color: theme.colors.danger,
    marginBottom: theme.spacing.sm,
  },
});