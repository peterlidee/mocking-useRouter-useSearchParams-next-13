import { SortOrder } from '@/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import getSortOrderFromUseSearchParams from '../lib/getSortOrderFromUseSearchParams';

export default function useSort() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const sortOrder = getSortOrderFromUseSearchParams(params);

  const handleSort = (value: SortOrder) => {
    const newParams = new URLSearchParams(params.toString());
    newParams.set('sortOrder', value);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return { sortOrder, handleSort };
}
