import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useSort from '../useSort';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import getSortOrderFromUseSearchParams from '../../lib/getSortOrderFromUseSearchParams';

const pushMock = jest.fn();
// mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  usePathname: jest.fn(() => 'example.com'),
  useRouter: jest.fn(() => ({
    push: pushMock,
  })),
}));
jest.mock('../../lib/getSortOrderFromUseSearchParams');
getSortOrderFromUseSearchParams.mockReturnValue('aaaa');

function setup(toString = '') {
  useSearchParams.mockReturnValue({
    toString: () => toString,
  });
  render(<TestComponent />);
  const heading = screen.getByRole('heading', { level: 1 });
  const button = screen.getByRole('button');
  return { heading, button };
}

function TestComponent() {
  const { sortOrder, handleSort } = useSort();
  return (
    <>
      <h1>{sortOrder}</h1>
      <button onClick={() => handleSort('bbbb')}>sort</button>
    </>
  );
}

describe('hooks/useSort in TestComponent', () => {
  test('TestComponent renders', () => {
    const { heading, button } = setup();
    expect(useSearchParams).toHaveBeenCalled();
    expect(usePathname).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();

    expect(heading).toHaveTextContent('aaaa');
    expect(button).toBeInTheDocument();
  });

  describe('handleSort function, returned from useSort works correctly', () => {
    test('It calls router.push mock with the correct string', async () => {
      const user = userEvent.setup();
      const { button } = setup();
      await user.click(button);
      expect(pushMock).toHaveBeenCalledWith(`example.com?sortOrder=bbbb`);
    });

    test('It adds our sortOrder parameter to existing parameters', async () => {
      const user = userEvent.setup();
      const { button } = setup('foo=bar');
      await user.click(button);
      expect(pushMock).toHaveBeenCalledWith(
        `example.com?foo=bar&sortOrder=bbbb`
      );
    });

    test('It adds overwrites an existing sortOrder parameter', async () => {
      const user = userEvent.setup();
      const { button } = setup('sortOrder=cccc');
      await user.click(button);
      expect(pushMock).toHaveBeenCalledWith(`example.com?sortOrder=bbbb`);
    });
  });
});
