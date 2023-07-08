import isValidSortOrder from '../isValidSortOrder';

describe('@/lib/isValidSortOrder', () => {
  test('It correctly validates "asc"', () => {
    const result = isValidSortOrder('asc');
    expect(result).toBe(true);
  });

  test('It correctly validates "desc"', () => {
    const result = isValidSortOrder('desc');
    expect(result).toBe(true);
  });

  test('It returns invalid for value undefined', () => {
    const result = isValidSortOrder(undefined);
    expect(result).toBe(false);
  });

  test('It returns invalid for value "foobar"', () => {
    const result = isValidSortOrder('foobar');
    expect(result).toBe(false);
  });
});
