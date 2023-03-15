export interface SuiTxResult {
  effects: {
    deleted: {
      objectId: string;
    }[];
  };
}
