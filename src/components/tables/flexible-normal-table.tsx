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
    return (
        <div className="w-full border border-gray-200">
            {/* Header row */}
            <div className="w-full overflow-x-auto">
                <table className="w-full table-fixed">
                    <thead>
                    <tr className="font-semibold text-gray-700 bg-gray-100">
                        <th
                            className="px-2 py-2 border border-gray-200 text-center"
                            style={{
                                width: "50px",
                                wordBreak: 'break-word', // Allow text to wrap in header
                            }}
                        >
                            S/N
                        </th>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-2 py-2 border border-gray-200 text-center"
                                style={{
                                    minWidth: "100px", // Ensure minimum width for each column
                                    wordBreak: 'break-word', // Allow text to wrap in header
                                }}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="text-gray-700">
                            <td
                                className="px-2 py-2 border border-gray-200 text-center"
                                style={{ width: "50px" }}
                            >
                                {rowIndex + 1}
                            </td>

                            {columns.map((column, colIndex) => (
                                <td
                                    key={column.accessor}
                                    className={`px-2 py-2 border border-gray-200 break-words ${
                                        colIndex < columns.length - 1 ? 'border-r' : ''
                                    } ${column?.isAlignRight ? 'text-right' : 'text-left'}`}
                                    style={{
                                        wordBreak: 'break-word', // Allow text to wrap in body cells
                                        minWidth: "100px", // Ensure minimum width for each column
                                    }}
                                >
                                    {Array.isArray(row[column.accessor]) && subTableAccessor === column.accessor
                                        ? "renderSubTable(row[column.accessor])" // Render sub-table if it's an array
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
        </div>
    );
};

export default ReusableTable;
