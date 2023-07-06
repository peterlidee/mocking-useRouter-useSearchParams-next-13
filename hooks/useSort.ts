import isValidSortOrder from '@/lib/isValidSortOrder';
import { SortOrder } from '@/types/SortOrder';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function useSort() {
  const params = useSearchParams();
  const sortOrderParam = params.get('sortOrder');
  const pathname = usePathname();
  const router = useRouter();

  let sortOrder: SortOrder = 'asc';
  // type narrow
  if (params.has('sortOrder') && sortOrderParam) {
    if (isValidSortOrder(sortOrderParam)) {
      sortOrder = sortOrderParam;
    }
  }

  const handleSort = (value: SortOrder) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set('sortOrder', value);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return { sortOrder, handleSort };
}
