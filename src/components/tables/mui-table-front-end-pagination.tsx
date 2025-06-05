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
import { visuallyHidden } from '@mui/utils';

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
    const { order, orderBy, numSelected, rowCount, onRequestSort, columns } = props;

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
}

export default function MuiTableFrontEndPagination({ columns, data, from }: Props) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<number>(-1); // Changed to use column index
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: number,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (index: number) => selected.indexOf(index) !== -1;

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const visibleRows = React.useMemo(() => {
        const sortedData = [...data].sort((a, b) => {
            const valueA = String(a[orderBy] || '').toLowerCase();
            const valueB = String(b[orderBy] || '').toLowerCase();

            if (order === 'desc') {
                return valueB.localeCompare(valueA);
            }
            return valueA.localeCompare(valueB);
        });
        return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [data, order, orderBy, page, rowsPerPage]);

    return (
        <Box sx={{ width: '100%', marginTop: '10px' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: `${from === 'monitoring' ? 50 : 750}` }}
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
                                    sx={{ padding: '50px' }}
                                >
                                    <TableCell
                                        component="th"
                                        id={`enhanced-table-checkbox-${index}`}
                                        scope="row"
                                        sx={{ marginRight: "1px solid black" }}
                                    >
                                        {page * rowsPerPage + index + 1}
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
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={columns.length + 1} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {from !== "monitoring" && <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />}
            </Paper>
        </Box>
    );
}