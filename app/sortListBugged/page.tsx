import { SortOrder } from '@/types/SortOrder';
import isValidSortOrder from '@/lib/isValidSortOrder';
import ListControlesRadios from '@/components/ListControlesRadios';
import List from '@/components/List';

const list = ['Banana', 'Apple', 'Lemon', 'Cherry'];

type Props = {
  searchParams: {
    foo?: string;
    sortOrder?: SortOrder;
  };
};

export default function Page({ searchParams }: Props) {
  const sortOrderParam = searchParams.sortOrder;
  let sortOrder: SortOrder = 'asc';
  if ('sortOrder' in searchParams && sortOrderParam) {
    if (isValidSortOrder(sortOrderParam)) {
      sortOrder = sortOrderParam;
    }
  }
  return (
    <>
      <ListControlesRadios />
      <List sortOrder={sortOrder} list={list} />
    </>
  );
}
