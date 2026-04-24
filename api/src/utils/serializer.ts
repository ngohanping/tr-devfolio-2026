function toNum(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'bigint') return Number(val);
  if (typeof val === 'object' && 'low' in val) return val.low;
  return Number(val);
}

export function serializeNeo4jResponse(data: any): any {
  if (data === null || data === undefined) return data;

  if (typeof data === 'bigint') return Number(data);

  if (typeof data === 'object' && 'toNumber' in data && typeof data.toNumber === 'function') {
    return data.toNumber();
  }

  if (
    typeof data === 'object' &&
    'year' in data &&
    'month' in data &&
    'day' in data
  ) {
    const year = toNum(data.year);
    const month = toNum(data.month);
    const day = toNum(data.day);
    const hour = toNum(data.hour);
    const minute = toNum(data.minute);
    const second = toNum(data.second);
    const ms = Math.floor(toNum(data.nanosecond) / 1000000);

    return new Date(Date.UTC(year, month - 1, day, hour, minute, second, ms)).toISOString();
  }

  if (Array.isArray(data)) {
    return data.map(serializeNeo4jResponse);
  }

  if (typeof data === 'object') {
    const out: any = {};
    for (const key of Object.keys(data)) {
      out[key] = serializeNeo4jResponse(data[key]);
    }
    return out;
  }

  return data;
}
