export interface User {
  id: number;
  nombre: string;
  apellidos: string;
  carnetIdentidad: string;
  empresa: string;
  cargo: string;
  telefono: string;
  email: string;
  rol: string;
  fotoPerfil?: string;
} 