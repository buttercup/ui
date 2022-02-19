import { useEffect, useState } from "react";
import { onLanguageChanged, t } from "../i18n/trans";

export function useTranslations() {
    const [tFunc, setTFunc] = useState({ t });
    useEffect(() => {
        let mounted = true;
        const removeListener = onLanguageChanged(() => {
            if (!mounted) return;
            setTFunc({ t });
        });
        return () => {
            mounted = false;
            removeListener();
        };
    }, []);
    return tFunc.t;
}
