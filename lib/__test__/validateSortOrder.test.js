import validateSortOrder from '../validateSortOrder';

describe('@/lib/isValidSortOrder', () => {
  test('It correctly validates "asc"', () => {
    const result = validateSortOrder('asc');
    expect(result).toBe(true);
  });

  test('It correctly validates "desc"', () => {
    const result = validateSortOrder('desc');
    expect(result).toBe(true);
  });

  test('It returns invalid for value undefined', () => {
    const result = validateSortOrder(undefined);
    expect(result).toBe(false);
  });

  test('It returns invalid for value "foobar"', () => {
    const result = validateSortOrder('foobar');
    expect(result).toBe(false);
  });
});
