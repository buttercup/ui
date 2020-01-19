import { useEffect } from 'react';
import { hashVaultFacade, isVaultFacade } from '@buttercup/facades';

export function useDeepEffect(callback, dependencies = []) {
  useEffect(callback, dependencies.map(dep => (isVaultFacade(dep) ? hashVaultFacade(dep) : dep)));
}
