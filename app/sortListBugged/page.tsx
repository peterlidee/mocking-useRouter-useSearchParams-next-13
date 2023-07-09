import { SearchParams } from '@/types';
import getSortOrderFromSearchParams from '@/lib/getSortOrderFromSearchParams';
import ListControlesRadios from '@/components/ListControlesRadios';
import List from '@/components/List';

type Props = {
  searchParams: SearchParams;
};

export default function Page({ searchParams }: Props) {
  const sortOrder = getSortOrderFromSearchParams(searchParams);
  return (
    <>
      <ListControlesRadios />
      <List sortOrder={sortOrder} />
    </>
  );
}
