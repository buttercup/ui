import { useEffect } from "react";
import { isVaultFacade } from "buttercup/web";

export function useDeepEffect(callback, dependencies = []) {
    useEffect(
        callback,
        dependencies.map(dep => (isVaultFacade(dep) ? dep._tag : dep))
    );
}
