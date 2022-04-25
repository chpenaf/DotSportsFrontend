export interface ListLocations {
  count?: number;
  next?: number;
  previus?: number;
  results: Location[]
}

export interface Location {
  id?: number;
  name: string;
  address: string;
  id_region: string;
  region: string;
  city: string;
  id_city: string;
  phone: string;
  image?: File | undefined;
  full_address?: string;
  pools?: Pool[]
}

export interface LocationSelect {
  id: number;
  name: string;
  pools?: PoolSelect[];
}

export interface PoolSelect {
  id: number;
  name: string;
  lanes?: Lane[]
}

export interface Pool {
  id?: number;
  name: string;
  location: number;
  lanes: number;
  width: number;
  length: number;
  min_depth: number;
  max_depth: number;
  is_available: boolean;
}

export interface Lane {
  id?: number;
  id_pool?: number;
  lane_no?: number;
}

export interface LocationResponse {
  message: string;
  data: Location;
}

export interface LocationForm {
  title: string;
  create: boolean;
  update: boolean;
  location?: Location;
}

export interface PoolForm {
  title: string;
  location: Location;
}
