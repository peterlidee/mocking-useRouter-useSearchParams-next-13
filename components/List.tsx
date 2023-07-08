import { SortOrder } from '@/types/SortOrder';

const list = ['Banana', 'Apple', 'Lemon', 'Cherry'];

type Props = {
  sortOrder: SortOrder;
};

export default function List({ sortOrder }: Props) {
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
