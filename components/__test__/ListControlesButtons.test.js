import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListControlesButtons from '../ListControlesButtons';
import useSort from '../../hooks/useSort';

jest.mock('../../hooks/useSort');
const handleSortMock = jest.fn();

function setup(sortOrder) {
  useSort.mockReturnValue({
    sortOrder: sortOrder,
    handleSort: handleSortMock,
  });
  render(<ListControlesButtons />);
}

describe('@components/ListControlesButtons.tsx', () => {
  describe('It renders', () => {
    test('It renders "sort order:"', () => {
      setup('asc');
      expect(screen.getByText(/sort order:/i)).toBeInTheDocument();
    });
    test('It displays ascending when useSort.sortOrder = asc', () => {
      setup('asc');
      expect(screen.getByText(/sort order: ascending/i)).toBeInTheDocument();
    });
    test('It displays descending when useSort.sortOrder = desc', () => {
      setup('desc');
      expect(screen.getByText(/sort order: descending/i)).toBeInTheDocument();
    });
    test('It displays 2 buttons', () => {
      setup('asc');
      expect(
        screen.getByRole('button', { name: 'sort ascending' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'sort descending' })
      ).toBeInTheDocument();
    });
  });

  test('It calls handleSort with the correct argument on button clicks', async () => {
    const user = userEvent.setup();
    setup('asc');
    const buttonAsc = screen.getByRole('button', { name: /sort ascending/i });
    const buttonDesc = screen.getByRole('button', {
      name: /sort descending/i,
    });
    await user.click(buttonAsc);
    expect(handleSortMock).toHaveBeenCalledWith('asc');
    await user.click(buttonDesc);
    expect(handleSortMock).toHaveBeenLastCalledWith('desc');
  });
});
