import { convertToISOString, formatDateForDisplay, isExpired } from './dateUtils';

describe('dateUtils', () => {
  describe('convertToISOString', () => {
    it('should convert datetime-local to ISO string', () => {
      const datetimeLocal = '2024-12-31T23:59';
      const result = convertToISOString(datetimeLocal);

      // Check that the result is a valid ISO string
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

      // Check that the date is correct
      const date = new Date(result!);
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(11); // December (0-based)
      expect(date.getDate()).toBe(31);
    });

    it('should return undefined for empty string', () => {
      expect(convertToISOString('')).toBeUndefined();
    });
  });

  describe('formatDateForDisplay', () => {
    it('should format date for display', () => {
      const isoString = '2024-12-31T23:59:59.000Z';
      const result = formatDateForDisplay(isoString);

      // Check that the result contains date and time
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/); // Date format
      expect(result).toMatch(/\d{2}:\d{2}:\d{2}/); // Time format
    });

    it('should return "No expiration" for null', () => {
      expect(formatDateForDisplay(null)).toBe('No expiration');
    });

    it('should return "No expiration" for undefined', () => {
      expect(formatDateForDisplay(undefined)).toBe('No expiration');
    });
  });

  describe('isExpired', () => {
    it('should return true for past date', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Yesterday
      expect(isExpired(pastDate)).toBe(true);
    });

    it('should return false for future date', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Tomorrow
      expect(isExpired(futureDate)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isExpired(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isExpired(undefined)).toBe(false);
    });
  });
});