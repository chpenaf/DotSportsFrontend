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

export interface Pool {
  id?: number;
  name: string;
  id_location: number;
  lanes: number;
  width: number;
  length: number;
  min_depth: number;
  max_depth: number;
  is_available: boolean;
}

export interface Lane {
  id?: number;
  id_pool: number;
  lane_no: number;
}

export interface LocationResponse {
  message: string;
  data: Location;
}
