import { SortOrder } from '@/types';
import { ReadonlyURLSearchParams } from 'next/navigation';
import validateSortOrder from '../lib/validateSortOrder';

export default function getSortOrderFromUseSearchParams(
  params: ReadonlyURLSearchParams
) {
  const sortOrderParam = params.get('sortOrder');
  let sortOrder: SortOrder = 'asc';
  if (params.has('sortOrder') && sortOrderParam) {
    if (validateSortOrder(sortOrderParam)) {
      sortOrder = sortOrderParam;
    }
  }
  return sortOrder;
}
