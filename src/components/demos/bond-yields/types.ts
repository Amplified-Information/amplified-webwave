
export interface BondData {
  date: string;
  value: number;
}

export interface Bond {
  id: string;
  name: string;
  color: string;
  data: BondData[];
}

export interface BondSeries {
  id: string;
  name: string;
  color: string;
  visible: boolean;
}
