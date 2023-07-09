import { SearchParams } from '@/types';
import getSortOrderFromSearchParams from '@/lib/getSortOrderFromSearchParams';
import ListControlesButtons from '@/components/ListControlesButtons';
import List from '@/components/List';

type Props = {
  searchParams: SearchParams;
};

export default function Page({ searchParams }: Props) {
  const sortOrder = getSortOrderFromSearchParams(searchParams);
  return (
    <>
      <ListControlesButtons />
      <List sortOrder={sortOrder} />
    </>
  );
}
