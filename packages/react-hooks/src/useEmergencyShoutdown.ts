import { bool } from '@polkadot/types';
import { useQuery } from './useQuery';

interface EmergencyShutdownData {
  canRefund: boolean;
  isShutdown: boolean;
}

export function useEmergencyShutdown (): EmergencyShutdownData {
  const { data: _isShutdown } = useQuery<bool>('query.emergencyShutdown.isShutdown', []);
  const { data: _canRefund } = useQuery<bool>('query.emergencyShutdown.canRefund', []);

  return {
    canRefund: _canRefund ? _canRefund.isTrue : false,
    isShutdown: _isShutdown ? _isShutdown.isTrue : false
  };
}
