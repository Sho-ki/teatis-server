export function removeTimestamp(obj) {
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  for (const key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      if (key === 'createdAt' || key === 'updatedAt') {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        removeTimestamp(obj[key]);
      }
    }
  }

  return obj;
}
