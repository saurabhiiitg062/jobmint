"use client";

import React, { useState } from 'react';
import { DynamicTable as DynamicTableType } from '@/types';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Edit2 } from 'lucide-react';

interface Props {
  tables: DynamicTableType[];
  onChange: (tables: DynamicTableType[]) => void;
}

export default function DynamicTableBuilder({ tables, onChange }: Props) {
  const [editingTableIndex, setEditingTableIndex] = useState<number | null>(null);
  const [editingCell, setEditingCell] = useState<{ tableIndex: number; rowIndex: number; colIndex: number } | null>(null);
  const [editingColumn, setEditingColumn] = useState<{ tableIndex: number; colIndex: number } | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<{ tableIndex: number; colIndex: number } | null>(null);
  const [dropTargetColumn, setDropTargetColumn] = useState<{ tableIndex: number; colIndex: number } | null>(null);

  const quickTemplates = [
    { key: 'vacancy', label: 'Vacancy Details', hint: 'Posts, seats, categories' },
    { key: 'fee', label: 'Application Fee', hint: 'Category-wise charges' },
    { key: 'ageLimit', label: 'Age Limit', hint: 'Age rules by category' },
    { key: 'cutoff', label: 'Cutoff Marks', hint: 'Previous year cutoff' },
    { key: 'examPattern', label: 'Exam Pattern', hint: 'Subjects and marks' },
    { key: 'salary', label: 'Salary Structure', hint: 'Pay level details' },
  ] as const;

  // Table templates
  const tableTemplates = {
    vacancy: {
      title: 'Vacancy Details',
      columns: ['Post', 'Department', 'UR', 'OBC', 'EWS', 'SC', 'ST', 'Total'],
      rows: [['', '', 0, 0, 0, 0, 0, 0]]
    },
    fee: {
      title: 'Application Fee',
      columns: ['Category', 'Fee'],
      rows: [['General', ''], ['OBC', ''], ['SC/ST', ''], ['Women', '']]
    },
    ageLimit: {
      title: 'Age Limit',
      columns: ['Category', 'Age Limit'],
      rows: [['General', ''], ['OBC', ''], ['SC/ST', '']]
    },
    cutoff: {
      title: 'Cutoff Marks (Previous Year)',
      columns: ['Category', 'Cutoff', 'Qualifying Marks'],
      rows: [['General', '', ''], ['OBC', '', ''], ['EWS', '', ''], ['SC', '', ''], ['ST', '', '']]
    },
    examPattern: {
      title: 'Exam Pattern',
      columns: ['Subject', 'Questions', 'Marks', 'Duration'],
      rows: [['', '', '', '']]
    },
    salary: {
      title: 'Salary Structure',
      columns: ['Level', 'Pay Scale', 'Grade Pay'],
      rows: [['', '', '']]
    }
  };

  // Add new table from template
  const addTableFromTemplate = (templateKey: keyof typeof tableTemplates) => {
    const template = tableTemplates[templateKey];
    const newTable: DynamicTableType = {
      title: template.title,
      columns: [...template.columns],
      rows: template.rows.map(row => [...row])
    };
    onChange([...tables, newTable]);
  };

  // Add custom table
  const addCustomTable = () => {
    const title = prompt('Enter table title (e.g., Vacancy Details, Application Fee, Exam Pattern):');
    if (!title) return;

    const newTable: DynamicTableType = {
      title,
      columns: ['Column 1'],
      rows: [['']]
    };

    onChange([...tables, newTable]);
  };

  // Delete table
  const deleteTable = (index: number) => {
    if (confirm('Are you sure you want to delete this table?')) {
      const newTables = tables.filter((_, i) => i !== index);
      onChange(newTables);
    }
  };

  // Move table up
  const moveTableUp = (index: number) => {
    if (index === 0) return;
    const newTables = [...tables];
    [newTables[index - 1], newTables[index]] = [newTables[index], newTables[index - 1]];
    onChange(newTables);
  };

  // Move table down
  const moveTableDown = (index: number) => {
    if (index === tables.length - 1) return;
    const newTables = [...tables];
    [newTables[index], newTables[index + 1]] = [newTables[index + 1], newTables[index]];
    onChange(newTables);
  };

  // Update table title
  const updateTableTitle = (index: number, title: string) => {
    const newTables = [...tables];
    newTables[index].title = title;
    onChange(newTables);
  };

  // Add column
  const addColumn = (tableIndex: number) => {
    const newTables = [...tables];
    newTables[tableIndex].columns.push(`Column ${newTables[tableIndex].columns.length + 1}`);
    newTables[tableIndex].rows = newTables[tableIndex].rows.map(row => [...row, '']);
    onChange(newTables);
  };

  // Delete column
  const deleteColumn = (tableIndex: number, colIndex: number) => {
    if (tables[tableIndex].columns.length <= 1) {
      alert('Table must have at least one column');
      return;
    }
    const newTables = [...tables];
    newTables[tableIndex].columns = newTables[tableIndex].columns.filter((_, i) => i !== colIndex);
    newTables[tableIndex].rows = newTables[tableIndex].rows.map(row => row.filter((_, i) => i !== colIndex));
    onChange(newTables);
  };

  const moveColumn = (tableIndex: number, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0) return;

    const table = tables[tableIndex];
    if (!table || toIndex >= table.columns.length) return;

    const newTables = [...tables];
    const currentTable = newTables[tableIndex];

    const [movedColumn] = currentTable.columns.splice(fromIndex, 1);
    const insertIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
    currentTable.columns.splice(insertIndex, 0, movedColumn);

    currentTable.rows = currentTable.rows.map((row) => {
      const nextRow = [...row];
      const [movedCell] = nextRow.splice(fromIndex, 1);
      nextRow.splice(insertIndex, 0, movedCell ?? '');
      return nextRow;
    });

    onChange(newTables);
  };

  const handleColumnDrop = (tableIndex: number, targetIndex: number) => {
    if (!draggedColumn || draggedColumn.tableIndex !== tableIndex) return;
    moveColumn(tableIndex, draggedColumn.colIndex, targetIndex);
    setDraggedColumn(null);
    setDropTargetColumn(null);
  };

  // Update column name
  const updateColumnName = (tableIndex: number, colIndex: number, name: string) => {
    const newTables = [...tables];
    newTables[tableIndex].columns[colIndex] = name;
    onChange(newTables);
  };

  // Add row
  const addRow = (tableIndex: number) => {
    const newTables = [...tables];
    const emptyRow = newTables[tableIndex].columns.map(() => '');
    newTables[tableIndex].rows.push(emptyRow);
    onChange(newTables);
  };

  // Delete row
  const deleteRow = (tableIndex: number, rowIndex: number) => {
    if (tables[tableIndex].rows.length <= 1) {
      alert('Table must have at least one row');
      return;
    }
    const newTables = [...tables];
    newTables[tableIndex].rows = newTables[tableIndex].rows.filter((_, i) => i !== rowIndex);
    onChange(newTables);
  };

  // Update cell value
  const updateCellValue = (tableIndex: number, rowIndex: number, colIndex: number, value: string) => {
    const newTables = [...tables];
    newTables[tableIndex].rows[rowIndex][colIndex] = value;
    onChange(newTables);
  };

  if (tables.length === 0) {
    return (
      <div className="bg-white border border-border-custom rounded-lg p-6 shadow-sm">
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm mb-4">No dynamic tables added yet</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 mb-4 text-left">
            {quickTemplates.map((template) => (
              <button type="button"
                key={template.key}
                onClick={() => addTableFromTemplate(template.key)}
                className="rounded-2xl border border-border-custom bg-slate-50 px-4 py-3 text-left transition hover:border-primary hover:bg-rose-50"
              >
                <p className="text-sm font-bold text-slate-900">{template.label}</p>
                <p className="mt-1 text-xs text-slate-500">{template.hint}</p>
              </button>
            ))}
          </div>
          <button type="button"
            onClick={addCustomTable}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-bold flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Custom Table</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">Dynamic Tables</h3>
      </div>

      <div className="rounded-2xl border border-border-custom bg-slate-50 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Quick add tables</p>
            <p className="text-xs text-slate-500">Pick a template and fill only the rows you need.</p>
          </div>
          <button type="button"
            onClick={addCustomTable}
            className="bg-primary hover:bg-[#600000] text-white px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1 w-fit"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Table</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {quickTemplates.map((template) => (
            <button type="button"
              key={template.key}
              onClick={() => addTableFromTemplate(template.key)}
              className="rounded-2xl border border-border-custom bg-white px-4 py-3 text-left transition hover:border-primary hover:bg-rose-50"
            >
              <p className="text-sm font-bold text-slate-900">{template.label}</p>
              <p className="mt-1 text-xs text-slate-500">{template.hint}</p>
            </button>
          ))}
        </div>
      </div>

      {tables.map((table, tableIndex) => (
        <div key={tableIndex} className="bg-white border border-border-custom rounded-lg shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="bg-primary text-white px-4 py-3 flex justify-between items-center">
            {editingTableIndex === tableIndex ? (
              <input
                type="text"
                value={table.title}
                onChange={(e) => updateTableTitle(tableIndex, e.target.value)}
                onBlur={() => setEditingTableIndex(null)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingTableIndex(null)}
                className="bg-white text-gray-800 px-2 py-1 rounded text-sm font-bold flex-1 mr-4"
                autoFocus
              />
            ) : (
              <span className="font-bold text-sm md:text-base">{table.title}</span>
            )}
            <div className="flex items-center space-x-1">
              <button type="button"
                onClick={() => setEditingTableIndex(tableIndex)}
                className="p-1 hover:bg-white/20 rounded"
                title="Edit Title"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button type="button"
                onClick={() => moveTableUp(tableIndex)}
                disabled={tableIndex === 0}
                className="p-1 hover:bg-white/20 rounded disabled:opacity-30"
                title="Move Up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button type="button"
                onClick={() => moveTableDown(tableIndex)}
                disabled={tableIndex === tables.length - 1}
                className="p-1 hover:bg-white/20 rounded disabled:opacity-30"
                title="Move Down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button type="button"
                onClick={() => deleteTable(tableIndex)}
                className="p-1 hover:bg-red-600 rounded"
                title="Delete Table"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {table.columns.map((column, colIndex) => (
                    <th
                      key={colIndex}
                      draggable
                      onDragStart={() => setDraggedColumn({ tableIndex, colIndex })}
                      onDragEnd={() => {
                        setDraggedColumn(null);
                        setDropTargetColumn(null);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggedColumn?.tableIndex === tableIndex) {
                          setDropTargetColumn({ tableIndex, colIndex });
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleColumnDrop(tableIndex, colIndex);
                      }}
                      className={`bg-secondary text-white px-2 py-2 border border-border-custom transition ${
                        dropTargetColumn?.tableIndex === tableIndex && dropTargetColumn?.colIndex === colIndex
                          ? 'ring-2 ring-amber-300 ring-inset'
                          : ''
                      } ${draggedColumn?.tableIndex === tableIndex && draggedColumn?.colIndex === colIndex ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-center space-x-1 cursor-move select-none">
                        <GripVertical className="w-3 h-3 opacity-70" />
                        {editingColumn?.tableIndex === tableIndex && editingColumn?.colIndex === colIndex ? (
                          <input
                            type="text"
                            value={column}
                            onChange={(e) => updateColumnName(tableIndex, colIndex, e.target.value)}
                            onBlur={() => setEditingColumn(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingColumn(null)}
                            className="bg-white text-gray-800 px-1 py-0.5 rounded text-xs font-semibold flex-1 w-24"
                            autoFocus
                          />
                        ) : (
                          <span
                            className="text-xs font-semibold cursor-pointer hover:underline"
                            onClick={() => setEditingColumn({ tableIndex, colIndex })}
                          >
                            {column}
                          </span>
                        )}
                        <button type="button"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => deleteColumn(tableIndex, colIndex)}
                          className="p-0.5 hover:bg-red-600 rounded"
                          title="Delete Column"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </th>
                  ))}
                  <th className="bg-gray-100 px-2 py-2 border border-border-custom w-10">
                    <button type="button"
                      onClick={() => addColumn(tableIndex)}
                      className="text-primary hover:text-[#600000]"
                      title="Add Column"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="even:bg-gray-50">
                    {table.columns.map((_, colIndex) => (
                      <td key={colIndex} className="border border-border-custom px-2 py-1">
                        {editingCell?.tableIndex === tableIndex && editingCell?.rowIndex === rowIndex && editingCell?.colIndex === colIndex ? (
                          <input
                            type="text"
                            value={row[colIndex] || ''}
                            onChange={(e) => updateCellValue(tableIndex, rowIndex, colIndex, e.target.value)}
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
                            className="w-full px-1 py-0.5 border rounded text-xs"
                            autoFocus
                          />
                        ) : (
                          <div
                            className="text-xs cursor-pointer hover:bg-gray-100 p-1 rounded min-h-[24px] flex items-center"
                            onClick={() => setEditingCell({ tableIndex, rowIndex, colIndex })}
                          >
                            {row[colIndex] || <span className="text-gray-300 italic">Empty</span>}
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="border border-border-custom px-2 py-1 text-center">
                      <button type="button"
                        onClick={() => deleteRow(tableIndex, rowIndex)}
                        className="text-status-danger hover:text-red-700"
                        title="Delete Row"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Row Button */}
          <div className="px-4 py-2 bg-gray-50 border-t border-border-custom">
            <button type="button"
              onClick={() => addRow(tableIndex)}
              className="text-xs font-bold text-primary hover:text-[#600000] flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Row</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
