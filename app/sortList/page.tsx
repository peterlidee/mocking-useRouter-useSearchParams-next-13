import { SortOrder } from '@/types/SortOrder';
import isValidSortOrder from '@/lib/isValidSortOrder';
import List from '@/components/List';
import ListControlesButtons from '@/components/ListControlesButtons';

const list = ['Banana', 'Apple', 'Lemon', 'Cherry'];

type Props = {
  searchParams: {
    foo?: string;
    sortOrder?: SortOrder;
  };
};

export default function page({ searchParams }: Props) {
  const sortOrderParam = searchParams.sortOrder;
  let sortOrder: SortOrder = 'asc';
  if ('sortOrder' in searchParams && sortOrderParam) {
    if (isValidSortOrder(sortOrderParam)) {
      sortOrder = sortOrderParam;
    }
  }
  return (
    <>
      <ListControlesButtons />
      <List sortOrder={sortOrder} list={list} />
    </>
  );
}
