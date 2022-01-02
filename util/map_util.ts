export function insertOrIncrementMapValue<T>(map: Map<T, number>, key: T, amount: number) {
    const val = map.get(key);
    if (!val) {
        map.set(key, amount);
    } else {
        map.set(key, val + amount);
    }
}
