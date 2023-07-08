import { SortOrder } from '@/types/SortOrder';
import isValidSortOrder from '@/lib/isValidSortOrder';
import List from '@/components/List';
import ListControlesButtons from '@/components/ListControlesButtons';

type Props = {
  searchParams: {
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
      <ListControlesButtons />
      <List sortOrder={sortOrder} />
    </>
  );
}
