let openFn: (() => void) | null = null;
export const registerShareDialog = (fn: () => void) => { openFn = fn; };
export const unregisterShareDialog = () => { openFn = null; };
export const triggerShareDialog = () => openFn?.();
