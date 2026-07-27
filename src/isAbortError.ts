export const isAbortError = (e: unknown, signals?: (AbortSignal|undefined|null)[]): boolean => {
    if(!!e && typeof e === 'object' && 'name' in e && e.name === 'AbortError')
        return true;

    const filtered = (signals ?? []).filter((v): v is AbortSignal => v !== undefined && v !== null);
    for(const signal of filtered){
        if(!signal.aborted)
            continue;

        if(e === signal.reason)
            return true;
    }

    return false;
}
