'use client';

import { SortOrder } from '@/types/SortOrder';
import useSort from '@/hooks/useSort';

export default function ListControles() {
  const { sortOrder, handleSort } = useSort();
  return (
    <fieldset>
      <legend>sort order:</legend>
      <label>
        <input
          type='radio'
          name='sortOrder'
          value='asc'
          checked={sortOrder === 'asc'}
          onChange={(e) => handleSort(e.target.value as SortOrder)}
        />
        ascending
      </label>
      <label>
        <input
          type='radio'
          name='sortOrder'
          value='desc'
          checked={sortOrder === 'desc'}
          onChange={(e) => handleSort(e.target.value as SortOrder)}
        />
        descending
      </label>
    </fieldset>
  );
}
