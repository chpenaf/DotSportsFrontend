import { LocationSelect, PoolSelect } from './location.interface';

export interface CapacityPool {
  id?: number;
  location: LocationSelect | number;
  pool: PoolSelect | number;
  capacity_lane?: number;
  begin_validity?: Date | string;
  end_validity?: Date | string;
}

export interface FormCapacityPool {
  title?: string;
  data?: CapacityPool;
}
