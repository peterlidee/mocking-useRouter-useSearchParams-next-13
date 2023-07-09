import getSortOrderFromSearchParams from '../getSortOrderFromSearchParams';
import validateSortOrder from '../validateSortOrder';

jest.mock('../validateSortOrder');

describe('@/lib/getSortOrderFromSearchParams', () => {
  test('It returns default "asc" when no sortOrder property', () => {
    validateSortOrder.mockReturnValue(true);
    const result = getSortOrderFromSearchParams({});
    expect(result).toBe('asc');
  });

  test('It returns default "asc" when sortOrder is empty', () => {
    validateSortOrder.mockReturnValue(true);
    const result = getSortOrderFromSearchParams({ sortOrder: '' });
    expect(result).toBe('asc');
  });

  test('It returns default "asc" when sortOrder is undefined', () => {
    validateSortOrder.mockReturnValue(true);
    const result = getSortOrderFromSearchParams({ sortOrder: undefined });
    expect(result).toBe('asc');
  });

  test('It returns default "asc" when validateSortOrder returns false', () => {
    validateSortOrder.mockReturnValue(false);
    const result = getSortOrderFromSearchParams({ sortOrder: 'foobar' });
    expect(result).toBe('asc');
  });

  test('It returns sortOrder value when validateSortOrder returns true', () => {
    validateSortOrder.mockReturnValue(true);
    const result = getSortOrderFromSearchParams({ sortOrder: 'foobar' });
    expect(result).toBe('foobar');
  });
});
