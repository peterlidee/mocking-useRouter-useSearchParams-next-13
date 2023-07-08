import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import isValidSortOrder from '../../lib/isValidSortOrder';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useSort from '../useSort';

const pushMock = jest.fn();
// mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  usePathname: jest.fn(() => 'example.com'),
  useRouter: jest.fn(() => ({
    push: pushMock,
  })),
}));

jest.mock('../../lib/isValidSortOrder');

function setup(param = 'asc', hasParam = true, isValidParam, toString = '') {
  useSearchParams.mockReturnValue({
    get: () => param,
    has: () => hasParam,
    toString: () => toString,
  });
  isValidSortOrder.mockReturnValue(isValidParam);
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
      <button onClick={() => handleSort('aaaa')}>sort</button>
    </>
  );
}

describe('hooks/useSort in TestComponent', () => {
  test('TestComponent renders', () => {
    const { heading, button } = setup('asc', true, true);
    expect(useSearchParams).toHaveBeenCalled();
    expect(usePathname).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();

    expect(heading).toHaveTextContent('asc');
    expect(button).toBeInTheDocument();
  });

  describe('useSort hook returns correct sortOrder', () => {
    test('It returns "asc" when no sortOrder', () => {
      const { heading, button } = setup('', false, false);
      expect(heading).toHaveTextContent('asc');
    });

    test('It returns "asc" when sortOrder undefined', () => {
      const { heading } = setup(undefined, true, false);
      expect(heading).toHaveTextContent('asc');
    });

    test('It returns "asc" when sortOrder foobar', () => {
      const { heading } = setup('foobar', true, false);
      expect(heading).toHaveTextContent('asc');
    });

    test('It returns "foobar" when sortOrder foobar yet we set isValidSortOrder to true', () => {
      const { heading } = setup('foobar', true, true);
      expect(heading).toHaveTextContent('foobar');
    });

    test('It returns "asc" when sortOrder is asc', () => {
      const { heading } = setup('asc', true, true);
      expect(heading).toHaveTextContent('asc');
    });

    test('It returns "desc" when sortOrder is desc', () => {
      const { heading } = setup('desc', true, true);
      expect(heading).toHaveTextContent('desc');
    });
  });

  describe('handleSort function, returned from useSort works correctly', () => {
    test('It calls router.push mock with the correct string', async () => {
      const user = userEvent.setup();
      const { button } = setup();
      await user.click(button);
      expect(pushMock).toHaveBeenCalledWith(`example.com?sortOrder=aaaa`);
    });

    test('It adds our sortOrder parameter to existing parameters', async () => {
      const user = userEvent.setup();
      const { button } = setup('asc', true, true, 'foo=bar');
      await user.click(button);
      expect(pushMock).toHaveBeenCalledWith(
        `example.com?foo=bar&sortOrder=aaaa`
      );
    });

    test('It adds overwrites an existing sortOrder parameter', async () => {
      const user = userEvent.setup();
      const { button } = setup('asc', true, true, 'sortOrder=bbbb');
      await user.click(button);
      expect(pushMock).toHaveBeenCalledWith(`example.com?sortOrder=aaaa`);
    });
  });
});
