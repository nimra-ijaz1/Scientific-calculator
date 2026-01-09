
export type HistoryItem = {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
};

export enum CalcMode {
  STANDARD = 'STANDARD',
  SCIENTIFIC = 'SCIENTIFIC',
  GRAPHING = 'GRAPHING'
}

export type CalcState = {
  display: string;
  history: HistoryItem[];
  isDegrees: boolean;
  memory: number;
};
