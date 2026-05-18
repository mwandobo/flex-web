import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import {visuallyHidden} from '@mui/utils';
import {ReusableButton} from "@/components/button/reusable-button";
import {Search} from "lucide-react";

type Order = 'asc' | 'desc';

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: number) => void;
    order: Order;
    orderBy: number;
    rowCount: number;
    columns: any[];
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const {order, orderBy, onRequestSort, columns} = props;

    const createSortHandler = (property: number) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow style={{
                borderTop: '1px solid #d1d1d1',
                backgroundColor: '#d9dce0',
                color: 'black',
            }}>
                <TableCell
                    padding="checkbox"
                    style={{
                        fontSize: "10px",
                        fontWeight: 700
                    }}
                >
                    {'S/N'}
                </TableCell>
                {columns.map((headCell, index) => (
                    <TableCell
                        key={index}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === index ? order : false}
                        style={{
                            borderLeft: '1px solid #a8a6a6',
                            width: headCell.width,
                            fontSize: "12px",
                            fontWeight: 700
                        }}
                    >
                        <TableSortLabel
                            active={orderBy === index}
                            direction={orderBy === index ? order : 'asc'}
                            onClick={createSortHandler(index)}
                        >
                            {headCell.label}
                            {orderBy === index ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

interface Props {
    columns: any[];
    data: any[][];
    from?: string;
    page?: number;
    filterKey?: string;
    totalRecords?: number;
    rowsPerPage?: number;
    updatePage?: (page: number) => void
    updateRowsPerPage?: (rowsPerPage: number) => void
    updateFilterKey?: (filterKey: string) => void
}

export default function MuiTable({
                                     columns,
                                     data,
                                     from,
                                     rowsPerPage,
                                     page,
                                     updateRowsPerPage,
                                     updatePage,
                                     updateFilterKey,
                                     totalRecords,
    filterKey
                                 }: Props) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<number>(-1); // Changed to use column index
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [searchKey, setSearchKey] = React.useState('');



    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: number,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        updatePage(++newPage)
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRowsPerPage(parseInt(event.target.value, 10));
    };

    const isSelected = (index: number) => selected.indexOf(index) !== -1;

    const visibleRows = React.useMemo(() => {
        return [...data].sort((a, b) => {
            const valueA = String(a[orderBy] || '').toLowerCase();
            const valueB = String(b[orderBy] || '').toLowerCase();

            if (order === 'desc') {
                return valueB.localeCompare(valueA);
            }
            return valueA.localeCompare(valueB);
        });

    }, [data, order, orderBy, page, rowsPerPage]);

    return (
        <Box sx={{width: '100%', marginTop: '10px'}}>
            <div className={'flex w-full justify-end mb-2'}>
                <div className={'flex w-1/4 gap-2'}>
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{
                            padding: '6px 12px',
                            fontSize: '14px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            flex: 1,
                        }}
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                    />

                    <ReusableButton
                        name={'Search'}
                        onClick={() => updateFilterKey(searchKey)}
                        rounded={'md'}
                        padding={'p-3'}
                        shadow={'shadow-md'}
                        bg_color={'bg-gray-50'}
                        hover={'hover:bg-gray-200 hover:border-gray-400'}
                        hover_text={'hover:text-gray-900 hover:font-semibold'}
                        border={'border border-gray-300'}
                        text_color={'text-gray-700'}
                    >
                        <Search size={13}/>
                    </ReusableButton>

                </div>

            </div>
            <Paper sx={{width: '100%', mb: 2}}>
                <TableContainer>
                    <Table
                        sx={{minWidth: `${from === 'monitoring' ? 50 : 750}`}}
                        aria-labelledby="tableTitle"
                        size={'small'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={data.length}
                            columns={columns}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    aria-checked={isSelected(index)}
                                    tabIndex={-1}
                                    key={index}
                                    selected={isSelected(index)}
                                    sx={{padding: '50px'}}
                                >
                                    <TableCell
                                        component="th"
                                        id={`enhanced-table-checkbox-${index}`}
                                        scope="row"
                                        sx={{marginRight: "1px solid black"}}
                                    >
                                        {(page - 1) * rowsPerPage + index + 1}
                                    </TableCell>
                                    {row.map((cell, cellIndex) => (
                                        <TableCell
                                            key={cellIndex}
                                            padding="normal"
                                            style={{
                                                borderLeft: '1px solid #d1d1d1',
                                                fontSize: "12px"
                                            }}
                                        >
                                            {cell}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {from !== "monitoring" && <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalRecords ?? data.length}
                    rowsPerPage={rowsPerPage}
                    page={(page -1)}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />}
            </Paper>
        </Box>
    );
}