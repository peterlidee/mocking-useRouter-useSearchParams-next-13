import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ListControlesRadios from '../ListControlesRadios';
import useSort from '../../hooks/useSort';

jest.mock('../../hooks/useSort');
const handleSortMock = jest.fn();

function setup(sortOrder) {
  useSort.mockReturnValue({
    sortOrder: sortOrder,
    handleSort: handleSortMock,
  });
  render(<ListControlesRadios />);
  const radioAsc = screen.getByRole('radio', { name: 'ascending' });
  const radioDesc = screen.getByRole('radio', { name: 'descending' });
  return { radioAsc, radioDesc };
}

describe('@components/ListControlesRadios.tsx', () => {
  test('It renders', () => {
    const { radioAsc, radioDesc } = setup('');
    expect(screen.getByText(/sort order:/i)).toBeInTheDocument();
    expect(radioAsc).toBeInTheDocument();
    expect(radioDesc).toBeInTheDocument();
  });

  test('It checks the correct input on asc', () => {
    const { radioAsc, radioDesc } = setup('asc');
    expect(radioAsc).toBeChecked();
    expect(radioDesc).not.toBeChecked();
  });

  test('It checks the correct input on desc', () => {
    const { radioAsc, radioDesc } = setup('desc');
    expect(radioAsc).not.toBeChecked();
    expect(radioDesc).toBeChecked();
  });

  test('It calls handleSort with the correct argument on select desc', async () => {
    const user = userEvent.setup();
    const { radioDesc } = setup('asc');
    await user.click(radioDesc);
    expect(handleSortMock).toHaveBeenLastCalledWith('desc');
  });

  test('It calls handleSort with the correct argument on select asc', async () => {
    const user = userEvent.setup();
    const { radioAsc } = setup('desc');
    await user.click(radioAsc);
    expect(handleSortMock).toHaveBeenLastCalledWith('asc');
  });
});
