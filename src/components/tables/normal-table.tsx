import React from 'react';
import moneyFormater from "@/components/moneyFormater";

export interface TableColumn {
    header: string;
    accessor: string;
    isAlignRight?: boolean; // if true, align item right
    isMoney?: boolean; // if true, format as money
}

interface TableProps {
    columns: TableColumn[];
    data: Record<string, any>[];
    subTableColumns?: TableColumn[]; // Optional columns for nested tables
    subTableAccessor?: string; // Accessor for nested data, e.g., "items"
}

const ReusableTable: React.FC<TableProps> = ({
                                                 columns,
                                                 data,
                                                 subTableColumns = [],
                                                 subTableAccessor,
                                             }) => {
    // Function to render the nested sub-table for each cell with nested data
    const renderSubTable = (items: Record<string, any>[]) => (
        <table className="min-w-full bg-white border border-gray-200 my-2">
            <thead>
            <tr>
                {subTableColumns.map((column, index) => (
                    <th
                        key={column.accessor}
                        className={`px-2 py-1 text-left text-xs border-b border-gray-200 bg-gray-50 font-medium text-gray-600 ${
                            index < columns.length - 1 ? 'border-r' : ''
                        }`}
                    >
                        {column.header}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {items.map((item, index) => (
                <tr key={index}>
                    {subTableColumns.map((column, colIndex) => (
                        <td
                            key={column.accessor}
                            className={`px-2 py-1 text-xs border-b border-gray-200 text-gray-500 ${
                                colIndex < columns.length - 1 ? 'border-r' : ''
                            }  ${column?.isAlignRight ? 'text-right' : 'text-left'}`}
                        >
                            {
                                column.isMoney
                                    ? moneyFormater({amount: item[column.accessor]}) // Format as currency if `isMoney` is true
                                    : item[column.accessor] ?? '-'
                            }
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr>
                    <th className="px-2 py-2 text-left text-xs border-b border-gray-200 bg-gray-100 font-medium text-gray-700 border-r w-16">
                        S/N
                    </th>
                    {columns.map((column, index) => (
                        <th
                            key={column.accessor}
                            className={`px-4 py-2 text-left border-b border-gray-200 bg-gray-100 font-medium text-sm text-gray-700 ${
                                index < columns.length - 1 ? 'border-r' : ''
                            }`}
                        >
                            {column.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-xs border-b border-gray-200 text-gray-600 border-r text-left w-16">
                            {rowIndex + 1}
                        </td>
                        {columns.map((column, colIndex) => (
                            <td
                                key={column.accessor}
                                className={`px-4 py-2 border-b text-xs border-gray-200 text-gray-600  ${
                                    colIndex < columns.length - 1 ? 'border-r' : ''
                                // } ${column.isAlignRight ? 'text-right' : 'text-left'}`}
                                } ${column?.isAlignRight ? 'text-right' : 'text-left'}`}
                            >
                                {Array.isArray(row[column.accessor]) && subTableAccessor === column.accessor
                                    ? renderSubTable(row[column.accessor]) // Render sub-table if it's an array
                                    : column.isMoney
                                        ? moneyFormater({amount: row[column.accessor]}) // Format as currency if `isMoney` is true
                                        : row[column.accessor] ?? '-'}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReusableTable;
