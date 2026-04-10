export interface User {
  id: string;
  email: string;
  password: string;
  tipo: 'matriculado' | 'administrador';
  nombre: string;
  apellido: string;
  dni: string;
  ciudad: string;
  celular: string;
  domicilio: string;
  estudio?: string;
  redes?: {
    instagram?: string;
    facebook?: string;
    paginaWeb?: string;
    linkedin?: string;
    behance?: string;
  };
  fotoPerfil?: string;
  numeroMatricula?: string;
  estado: 'activo' | 'suspendido' | 'baja';
  estadoPago: 'al_dia' | 'deuda';
  montoDeuda?: number;
  fechaVencimiento?: string;
  fechaUltimoPago?: string;
  notificaciones: Notificacion[];
}

export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  tipo: 'info' | 'warning' | 'success' | 'error';
}

export interface ConfiguracionSistema {
  precioMatricula: number;
  fechaInicioPago: string;
  fechaVencimientoPago: string;
}

export interface Ciudad {
  id: string;
  nombre: string;
}

export interface FiltroDirectorio {
  nombre: string;
  matricula: string;
  ciudad: string;
}
