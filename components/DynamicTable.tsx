import React from 'react';
import { DynamicTable as DynamicTableType } from '@/types';

interface Props {
  table: DynamicTableType;
}

export default function DynamicTable({ table }: Props) {
  if (!table || !table.columns || !table.rows || table.columns.length === 0 || table.rows.length === 0) {
    return null;
  }

  return (
    <div className="my-4">
      {/* Table Title */}
      <h3 className="text-base md:text-lg font-bold text-secondary mb-3">{table.title}</h3>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="sarkari-table w-full">
          <thead>
            <tr>
              {table.columns.map((column, index) => (
                <th
                  key={index}
                  className="text-left"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {table.columns.map((_, colIndex) => (
                  <td
                    key={colIndex}
                    dangerouslySetInnerHTML={{
                      __html: row[colIndex] !== undefined && row[colIndex] !== null ? String(row[colIndex]) : ''
                    }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
