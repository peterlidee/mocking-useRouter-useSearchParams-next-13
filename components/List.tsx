import { SortOrder } from '@/types';

type Props = {
  sortOrder: SortOrder;
};

export default function List({ sortOrder }: Props) {
  const list = ['Banana', 'Apple', 'Lemon', 'Cherry'];
  const sortedList = [...list].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a > b ? 1 : -1;
    }
    return a < b ? 1 : -1;
  });
  return (
    <ul>
      {sortedList.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
