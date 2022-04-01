export interface Region {
  codigo: string;
  tipo?: string;
  nombre: string;
  lat?: number;
  lng?: number;
  url?: string;
  codigo_padre?: string;
}

export interface Comuna {
  codigo: string;
  tipo?: string;
  nombre: string;
  lat?: number;
  lng?: number;
  url?: string;
  codigo_padre?: string;
}
