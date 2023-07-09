import { render, screen } from '@testing-library/react';
import List from '../List';

describe('@components/List.tsx', () => {
  test('It renders', () => {
    render(<List sortOrder='asc' />);
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
  test('It renders the list ascending', () => {
    render(<List sortOrder='asc' />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent('Apple');
    expect(items[1]).toHaveTextContent('Banana');
    expect(items[2]).toHaveTextContent('Cherry');
    expect(items[3]).toHaveTextContent('Lemon');
  });
  test('It renders the list descending', () => {
    render(<List sortOrder='desc' />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent('Lemon');
    expect(items[1]).toHaveTextContent('Cherry');
    expect(items[2]).toHaveTextContent('Banana');
    expect(items[3]).toHaveTextContent('Apple');
  });
});
