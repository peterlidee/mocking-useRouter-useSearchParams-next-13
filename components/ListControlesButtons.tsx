'use client';

import useSort from '@/hooks/useSort';

export default function ListControles() {
  const { sortOrder, handleSort } = useSort();
  const sortOrderFull = sortOrder === 'asc' ? 'ascending' : 'descending';

  return (
    <div>
      <div>sort order: {sortOrderFull}</div>
      <button onClick={() => handleSort('asc')}>sort ascending</button>
      <button onClick={() => handleSort('desc')}>sort descending</button>
    </div>
  );
}
