import { render, screen } from '@testing-library/react';
import List from '../List';

const testList = ['a', 'c', 'b'];

describe('@components/List.tsx', () => {
  test('It renders', () => {
    render(<List list={[]} sortOrder='asc' />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
  test('It renders the list ascending', () => {
    render(<List list={testList} sortOrder='asc' />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('a');
    expect(items[1]).toHaveTextContent('b');
    expect(items[2]).toHaveTextContent('c');
  });
  test('It renders the list descending', () => {
    render(<List list={testList} sortOrder='desc' />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('c');
    expect(items[1]).toHaveTextContent('b');
    expect(items[2]).toHaveTextContent('a');
  });
});
