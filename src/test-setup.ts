// Polyfill Map.groupBy for Node < 21
if (typeof (Map as any).groupBy !== 'function') {
  (Map as any).groupBy = function (items: Iterable<any>, keyFn: (item: any, index: number) => any) {
    const result = new Map();
    let i = 0;
    for (const item of items) {
      const key = keyFn(item, i++);
      if (!result.has(key)) result.set(key, []);
      result.get(key).push(item);
    }
    return result;
  };
}
