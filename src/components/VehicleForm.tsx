import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { theme } from '../theme';

export type VehicleFormValues = {
  plate: string;
  brand: string;
  model: string;
  year: string;
  color: string;
};

type VehicleFormProps = {
  initialValues: VehicleFormValues;
  title: string;
  subtitle: string;
  submitLabel: string;
  submitColor: string;
  errorMessage: string;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
};

const validationSchema = Yup.object({
  plate: Yup.string()
    .trim()
    .required('Informe a placa do veículo.')
    .matches(
      /^[A-Za-z]{3}-?[0-9][A-Za-z0-9][0-9]{2}$/,
      'Informe uma placa válida.',
    ),
  brand: Yup.string().trim().required('Informe a marca.'),
  model: Yup.string().trim().required('Informe o modelo.'),
  year: Yup.string()
    .required('Informe o ano.')
    .matches(/^\d{4}$/, 'O ano deve conter quatro números.')
    .test('valid-year', 'Informe um ano válido.', (value) => {
      if (!value || !/^\d{4}$/.test(value)) return true;

      const year = Number(value);
      return year >= 1900 && year <= new Date().getFullYear() + 1;
    }),
  color: Yup.string().trim().required('Informe a cor.'),
});

export default function VehicleForm({
  initialValues,
  title,
  subtitle,
  submitLabel,
  submitColor,
  errorMessage,
  onSubmit,
}: VehicleFormProps) {
  const [saving, setSaving] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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

  const formik = useFormik<VehicleFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setSaving(true);
        await onSubmit({
          plate: values.plate.trim().toUpperCase(),
          brand: values.brand.trim(),
          model: values.model.trim(),
          year: values.year.trim(),
          color: values.color.trim(),
        });
        resetForm();
      } catch (error) {
        console.error('Erro ao salvar veículo:', error);
        Alert.alert('Não foi possível salvar', errorMessage);
      } finally {
        setSaving(false);
      }
    },
  });

  function renderField(
    name: keyof VehicleFormValues,
    label: string,
    placeholder: string,
    options?: {
      keyboardType?: 'default' | 'numeric';
      autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    },
  ) {
    const showError = Boolean(formik.touched[name] && formik.errors[name]);

    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[styles.input, showError && styles.inputError]}
          value={formik.values[name]}
          onChangeText={formik.handleChange(name)}
          onBlur={formik.handleBlur(name)}
          placeholder={placeholder}
          keyboardType={options?.keyboardType ?? 'default'}
          autoCapitalize={options?.autoCapitalize ?? 'sentences'}
          editable={!saving}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          accessibilityLabel={label}
        />
        {showError && (
          <Text style={styles.errorText}>{formik.errors[name]}</Text>
        )}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {renderField('plate', 'Placa', 'Ex.: ABC1D23', {
          autoCapitalize: 'characters',
        })}
        {renderField('brand', 'Marca', 'Ex.: Toyota', {
          autoCapitalize: 'words',
        })}
        {renderField('model', 'Modelo', 'Ex.: Corolla', {
          autoCapitalize: 'words',
        })}
        {renderField('year', 'Ano', 'Ex.: 2023', {
          keyboardType: 'numeric',
        })}
        {renderField('color', 'Cor', 'Ex.: Prata', {
          autoCapitalize: 'words',
        })}

        <View style={styles.submitButton}>
          {saving ? (
            <View style={[styles.submitAction, { backgroundColor: submitColor }]}>
              <ActivityIndicator color={theme.colors.surface} />
              <Text style={styles.submitActionText}>Salvando...</Text>
            </View>
          ) : (
            <Pressable
              style={[styles.submitAction, { backgroundColor: submitColor }]}
              onPress={() => formik.handleSubmit()}
              accessibilityRole="button"
              accessibilityLabel={submitLabel}
            >
              <MaterialCommunityIcons
                name="content-save-outline"
                size={21}
                color={theme.colors.surface}
              />
              <Text style={styles.submitActionText}>{submitLabel}</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
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
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  field: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.text,
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: theme.spacing.xs,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  submitAction: {
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
  },
  submitActionText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '700',
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