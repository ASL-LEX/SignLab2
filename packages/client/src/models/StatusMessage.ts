export interface StatusMessage {
  severity: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
