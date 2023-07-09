import { render } from '@testing-library/react';

import Page from '../page';
import getSortOrderFromSearchParams from '../../../lib/getSortOrderFromSearchParams';
import List from '../../../components/List';
import ListControlesButtons from '../../../components/ListControlesButtons';

jest.mock('../../../components/ListControlesButtons');
jest.mock('../../../components/List');
jest.mock('../../../lib/getSortOrderFromSearchParams');

describe('app/sortList/page.js', () => {
  test('It renders', () => {
    render(<Page searchParams={'aaaa'} />);
    expect(getSortOrderFromSearchParams).toHaveBeenCalled();
    expect(ListControlesButtons).toHaveBeenCalled();
    expect(List).toHaveBeenCalled();
  });

  test('It passes the correct sortOrder value to List', () => {
    getSortOrderFromSearchParams.mockReturnValue('bbbb');
    render(<Page searchParams={'aaaa'} />);
    expect(getSortOrderFromSearchParams).toHaveBeenCalledWith('aaaa');
    expect(List).toHaveBeenCalledWith(
      expect.objectContaining({
        sortOrder: 'bbbb',
      }),
      expect.anything()
    );
  });
});
