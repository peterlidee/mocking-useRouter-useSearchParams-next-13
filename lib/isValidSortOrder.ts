import { SortOrder } from '@/types/SortOrder';

// type predicate
// checks if value is valid SortBy type
export default function isValidSortOrder(value: string): value is SortOrder {
  const validOptions: [SortOrder, SortOrder] = ['asc', 'desc'];
  return validOptions.includes(value as SortOrder);
}
