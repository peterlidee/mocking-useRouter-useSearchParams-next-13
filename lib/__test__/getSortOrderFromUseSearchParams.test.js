import getSortOrderFromUseSearchParams from '../getSortOrderFromUseSearchParams';
import validateSortOrder from '../validateSortOrder';

jest.mock('../validateSortOrder');

function setup(value, hasValue) {
  const param = {
    get: () => value,
    has: () => hasValue,
  };
  return getSortOrderFromUseSearchParams(param);
}

describe('@/lib/getSortOrderFromUseSearchParams', () => {
  test('It returns default "asc" when no sortOrder property', () => {
    validateSortOrder.mockReturnValue(true);
    const result = setup('foobar', false);
    expect(result).toBe('asc');
  });

  test('It returns default "asc" when no sortOrder is empty', () => {
    validateSortOrder.mockReturnValue(true);
    const result = setup('', true);
    expect(result).toBe('asc');
  });

  test('It returns default "asc" when no sortOrder is undefined', () => {
    validateSortOrder.mockReturnValue(true);
    const result = setup(undefined, true);
    expect(result).toBe('asc');
  });

  test('It returns default "asc" when validateSortOrder returns false', () => {
    validateSortOrder.mockReturnValue(false);
    const result = setup('foobar', true);
    expect(result).toBe('asc');
  });

  test('It returns sortOrder value when validateSortOrder returns true', () => {
    validateSortOrder.mockReturnValue(true);
    const result = setup('foobar', true);
    expect(result).toBe('foobar');
  });
});
