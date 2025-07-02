export function convertToISOString(datetimeLocal: string): string | undefined {
  if (!datetimeLocal) {
    return undefined;
  }

  const date = new Date(datetimeLocal);
  return date.toISOString();
}

export function formatDateForDisplay(
  isoString: string | null | undefined,
): string {
  if (!isoString) {
    return 'No expiration';
  }

  return new Date(isoString).toLocaleString('en-US');
}

export function isExpired(isoString: string | null | undefined): boolean {
  if (!isoString) {
    return false;
  }

  return new Date() > new Date(isoString);
}
