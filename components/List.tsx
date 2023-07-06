import { SortOrder } from '@/types/SortOrder';

type Props = {
  list: string[];
  sortOrder: SortOrder;
};

export default function List({ sortOrder, list }: Props) {
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
