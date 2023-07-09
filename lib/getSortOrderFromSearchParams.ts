import { SearchParams, SortOrder } from '@/types';
import validateSortOrder from './validateSortOrder';

// set sortOrder to asc as default
// if there is a sortOrder parameter and it's not empty and it is valid, then use that
export default function getSortOrderFromSearchParams(
  searchParams: SearchParams
): SortOrder {
  const sortOrderParam = searchParams.sortOrder;
  let sortOrder: SortOrder = 'asc';
  if ('sortOrder' in searchParams && sortOrderParam) {
    if (validateSortOrder(sortOrderParam)) {
      sortOrder = sortOrderParam;
    }
  }
  return sortOrder;
}
