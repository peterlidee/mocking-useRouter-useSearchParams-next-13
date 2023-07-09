'use client';

import useSort from '@/hooks/useSort';

export default function ListControlesButtons() {
  const { sortOrder, handleSort } = useSort();
  return (
    <div>
      <div>sort order: {sortOrder === 'asc' ? 'ascending' : 'descending'}</div>
      <button onClick={() => handleSort('asc')}>sort ascending</button>
      <button onClick={() => handleSort('desc')}>sort descending</button>
    </div>
  );
}
