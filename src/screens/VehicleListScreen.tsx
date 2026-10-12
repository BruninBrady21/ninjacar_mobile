import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Button, FlatList, Keyboard, KeyboardAvoidingView,
  Platform, Pressable, StyleSheet, Text, TextInput, View, } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(showEvent, () =>
      setKeyboardVisible(true),
    );
    const hideSubscription = Keyboard.addListener(hideEvent, () =>
      setKeyboardVisible(false),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch === '' ||
      [vehicle.brand, vehicle.model, vehicle.plate, vehicle.color, String(vehicle.year)]
        .some((value) => value.toLowerCase().includes(normalizedSearch));

    const matchesBrand = vehicle.brand
      .toLowerCase()
      .includes(brandFilter.trim().toLowerCase());

    const matchesYear =
      yearFilter.trim() === '' ||
      String(vehicle.year).includes(yearFilter.trim());

    return matchesSearch && matchesBrand && matchesYear;
  });

  function clearFilters() {
    setSearchQuery('');
    setBrandFilter('');
    setYearFilter('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
    <View style={styles.container}>
      <Text style={styles.title}>Sua garagem</Text>

      <View style={styles.actionsRow}>
        <Pressable
          style={styles.actionButton}
          onPress={() => navigation.navigate('CreateVehicle')}
          accessibilityRole="button"
          accessibilityLabel="Cadastrar novo carro"
        >
          <MaterialCommunityIcons name="plus" size={22} color={theme.colors.surface} />
          <Text style={styles.actionButtonText}>Novo carro</Text>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.filterToggle]}
          onPress={() => setFiltersExpanded((expanded) => !expanded)}
          accessibilityRole="button"
          accessibilityState={{ expanded: filtersExpanded }}
          accessibilityLabel={filtersExpanded ? 'Ocultar filtros' : 'Mostrar filtros'}
        >
          <MaterialCommunityIcons name="filter-variant" size={20} color={theme.colors.text} />
          <Text style={styles.filterToggleText}>Filtros</Text>
          <MaterialCommunityIcons
            name={filtersExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.colors.text}
          />
        </Pressable>
      </View>

      {filtersExpanded && (
        <View style={styles.filterPanel}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por modelo, placa ou cor"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
        accessibilityLabel="Buscar veículos por modelo, placa, cor ou ano"
      />

      <TextInput
        style={styles.input}
        placeholder="Filtrar por marca (ex.: Toyota)"
        value={brandFilter}
        onChangeText={setBrandFilter}
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
        accessibilityLabel="Filtrar veículos por marca"
      />

      <TextInput
        style={styles.input}
        placeholder="Filtrar por ano (ex.: 2023)"
        value={yearFilter}
        onChangeText={setYearFilter}
        keyboardType="numeric"
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
        accessibilityLabel="Filtrar veículos por ano"
      />

      <Pressable
        style={styles.clearFiltersButton}
        onPress={clearFilters}
        accessibilityRole="button"
      >
        <MaterialCommunityIcons name="filter-remove-outline" size={18} color={theme.colors.primary} />
        <Text style={styles.clearFiltersText}>Limpar filtros</Text>
      </Pressable>
        </View>
      )}
      <Text style={styles.sectionTitle}>Veículos cadastrados</Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : error ? (
        <View>
          <Text style={styles.error}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadVehicles} accessibilityRole="button">
            <MaterialCommunityIcons name="refresh" size={20} color={theme.colors.surface} />
            <Text style={styles.actionButtonText}>Tentar novamente</Text>
          </Pressable>
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
              <Pressable
                style={styles.vehicleCard}
                onPress={() =>
                  navigation.navigate('VehicleDetails', { vehicleId: item.id })
                }
                accessibilityRole="button"
                accessibilityLabel={`Ver detalhes de ${item.brand} ${item.model}`}
              >
                <Text style={styles.vehicleTitle}>
                  {item.brand} {item.model}
                </Text>
                <Text>Placa: {item.plate}</Text>
                <Text>Ano: {item.year}</Text>
                <Text>Cor: {item.color}</Text>
                <Text style={styles.cardAction}>Toque para ver detalhes</Text>
              </Pressable>
            )}
          />
        </>
      )}
    </View>
    {keyboardVisible && (
      <View style={styles.keyboardAccessory}>
        <Button title="OK" onPress={Keyboard.dismiss} />
      </View>
    )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    minHeight: 46,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.sm,
  },
  actionButtonText: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: '700',
  },
  filterToggle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  filterToggleText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  filterPanel: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
  },
  clearFiltersButton: {
    minHeight: 42,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  clearFiltersText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  retryButton: {
    minHeight: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
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
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: 8,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  cardAction: {
    color: theme.colors.primary,
    fontWeight: '600',
    marginTop: theme.spacing.sm,
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
  keyboardAccessory: {
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});