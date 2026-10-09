import { api } from './api';

export async function testApi() {
  try {
    const response = await api.get('/vehicles');
    console.log('Veículos recebidos:', response.data);
  } catch (error) {
    console.error('Erro ao consultar a API:', error);
  }
}