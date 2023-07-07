import { screen, render } from '@testing-library/react';
import isValidSortOrder from '../../../lib/isValidSortOrder';
import List from '../../../components/List';
import ListControlesButtons from '../../../components/ListControlesButtons';
import Page from '../page';

jest.mock('../../../components/ListControlesButtons');
jest.mock('../../../components/List');
jest.mock('../../../lib/isValidSortOrder');

describe('app/sortList/page.js', () => {
  test('It renders', () => {
    render(<Page searchParams={{}} />);
    expect(ListControlesButtons).toHaveBeenCalled();
    expect(List).toHaveBeenCalled();
  });

  test('It passes the list', () => {
    render(<Page searchParams={{}} />);
    expect(List).toHaveBeenCalledWith(
      expect.objectContaining({
        list: ['Banana', 'Apple', 'Lemon', 'Cherry'],
      }),
      expect.anything()
    );
  });

  describe('It passes correct sortOrder to List', () => {
    test('It passes asc when no sortOrder', () => {
      render(<Page searchParams={{}} />);
      expect(isValidSortOrder).not.toHaveBeenCalled();
      expect(List).toHaveBeenCalledWith(
        expect.objectContaining({
          sortOrder: 'asc',
        }),
        expect.anything()
      );
    });

    test('It passes asc when undefined sortOrder', () => {
      render(<Page searchParams={{ sortOrder: undefined }} />);
      expect(isValidSortOrder).not.toHaveBeenCalled();
      expect(List).toHaveBeenCalledWith(
        expect.objectContaining({
          sortOrder: 'asc',
        }),
        expect.anything()
      );
    });

    test('It passes asc when sortOrder asc', () => {
      isValidSortOrder.mockReturnValue(true);
      render(<Page searchParams={{ sortOrder: 'asc' }} />);
      expect(isValidSortOrder).toHaveBeenCalledWith('asc');
      expect(List).toHaveBeenCalledWith(
        expect.objectContaining({
          sortOrder: 'asc',
        }),
        expect.anything()
      );
    });

    test('It passes desc when sortOrder desc', () => {
      isValidSortOrder.mockReturnValue(true);
      render(<Page searchParams={{ sortOrder: 'desc' }} />);
      expect(isValidSortOrder).toHaveBeenCalledWith('desc');
      expect(List).toHaveBeenCalledWith(
        expect.objectContaining({
          sortOrder: 'desc',
        }),
        expect.anything()
      );
    });
  });
});