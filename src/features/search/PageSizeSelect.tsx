import { useId } from 'react';

import { PAGE_SIZES, type PageSize } from '../../services/googleBooksApi';
import { isPageSize } from './searchParams';

interface PageSizeSelectProps {
  value: PageSize;
  onChange: (pageSize: PageSize) => void;
}

export function PageSizeSelect({ value, onChange }: PageSizeSelectProps) {
  const selectId = useId();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={selectId} className="whitespace-nowrap">
        Results per page
      </label>
      <select
        id={selectId}
        className="select select-lg w-24"
        value={value}
        onChange={(event) => {
          const pageSize = Number(event.target.value);
          if (isPageSize(pageSize)) {
            onChange(pageSize);
          }
        }}
      >
        {PAGE_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}
