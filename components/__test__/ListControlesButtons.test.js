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
  const buttonAsc = screen.getByRole('button', { name: /sort ascending/i });
  const buttonDesc = screen.getByRole('button', {
    name: /sort descending/i,
  });
  return { buttonAsc, buttonDesc };
}

describe('@components/ListControlesButtons.tsx', () => {
  test('It renders', () => {
    const { buttonAsc, buttonDesc } = setup();
    expect(screen.getByText(/sort order: /i)).toBeInTheDocument();
    expect(buttonAsc).toBeInTheDocument();
    expect(buttonDesc).toBeInTheDocument();
  });

  test('It displays sort order: ascending', () => {
    setup('asc');
    expect(screen.getByText(/sort order: ascending/i)).toBeInTheDocument();
  });

  test('It displays sort order: descending', () => {
    setup('desc');
    expect(screen.getByText(/sort order: descending/i)).toBeInTheDocument();
  });

  test('It calls handleSort with the correct argument on button clicks', async () => {
    const user = userEvent.setup();
    const { buttonAsc, buttonDesc } = setup();
    await user.click(buttonAsc);
    expect(handleSortMock).toHaveBeenCalledWith('asc');
    await user.click(buttonDesc);
    expect(handleSortMock).toHaveBeenLastCalledWith('desc');
  });
});
