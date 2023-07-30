import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { withStyles } from '@mui/styles';
import { Avatar, Skeleton } from '@mui/material';
import EmptyState from '../core/EmptyState';
import { CollectionSkeleton } from '../core/SkeletonHub';
import Link from 'next/link';
import { useQuery } from "@apollo/client"
import Router from 'next/router';
import { getAllCollections } from '../../apollo/api/query';
function createData(name, calories, fat, carbs, protein, owners) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
        owners
    };
}

const rows = [
    createData('Cupcake', 305, 3.7, 67, 4.3, 4.3),
    createData('Donut', 452, 25.0, 51, 4.9, 2.5),
    createData('Eclair', 262, 16.0, 24, 6.0, 2.5),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 2.5),
    createData('Gingerbread', 356, 16.0, 49, 3.9, 2.5),
    createData('Honeycomb', 408, 3.2, 87, 6.5, 2.5),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 2.5),
    createData('Jelly Bean', 375, 0.0, 94, 0.0, 2.5),
    createData('KitKat', 518, 26.0, 65, 7.0, 2.5),
    createData('Lollipop', 392, 0.2, 98, 0.0, 2.5),
    createData('Marshmallow', 318, 0, 81, 2.0, 2.5),
    createData('Nougat', 360, 19.0, 9, 37.0, 2.5),
    createData('Oreo', 437, 18.0, 63, 4.0, 2.5),
];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
const TableCell = withStyles({
    root: {
        borderBottom: "none"
    }
})(MuiTableCell);

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Collections',
    },
    {
        id: 'floor_price',
        numeric: true,
        disablePadding: false,
        label: 'Floor price',
    },
    {
        id: 'volume',
        numeric: true,
        disablePadding: false,
        label: 'Volume',
    },
    {
        id: 'items',
        numeric: true,
        disablePadding: false,
        label: 'Items',
    },
    {
        id: 'owners',
        numeric: true,
        disablePadding: false,
        label: 'Owners',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead style={{ background: "#E1E1E10F", width: "100%" }}>
            <TableRow>
                {/* <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell> */}
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
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

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Nutrition
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [filterValues, setFilterValues] = React.useState({
        minPrice: "",
        maxPrice: "",
        status: "All",
        nftType: ""
    });
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    React.useEffect(() => {
        if (props?.filter) {
            setFilterValues({
                minPrice: props?.filterValues?.minPrice,
                maxPrice: props?.filterValues?.maxPrice,
                status: props?.filterValues?.status,
                nftType: props?.filterValues?.nftType
            });
        }
    }, [props?.filter]);

    const { loading, data, error } = useQuery(getAllCollections, {
        variables: {
            name: props?.searchQuery,
            minPrice: filterValues?.minPrice,
            maxPrice: filterValues?.maxPrice,
            nftType: filterValues?.nftType
        }
    })

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.name);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        Router.push(`/collections/${id}`)
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    return (
        <Box sx={{ width: '100%', border: "1px solid #E1E1E126", padding: 1, borderRadius: 5 }}>
            <Paper sx={{ width: '100%', mb: 2, background: "transparent", border: "none" }}>
                <TableContainer style={{ width: "100%" }}>
                    {data?.getAllCollections?.length === 0 ?
                        <div className='flex items-center justify-center w-full' >
                            <EmptyState description="No collections found" />
                        </div>
                        :
                        <Table
                            sx={{ borderRadius: 5, overflow: "hidden" }}
                            aria-labelledby="tableTitle"
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {loading ? <CollectionSkeleton /> :
                                    data?.getAllCollections?.map((row, index) => {
                                        const isItemSelected = isSelected(row.name);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(event, row.collectionID)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.name}
                                                className='font-sans'
                                                selected={isItemSelected}
                                                sx={{ cursor: 'pointer', borderRadius: 20 }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    style={{ borderTopLeftRadius: 20, borderBottomLeftRadius: 20, }}
                                                    id={labelId}
                                                    scope="row"
                                                    padding="16"
                                                >
                                                    <div className='gap-2 flex flex-row items-center font-sans'>
                                                        <span className='mr-4 opacity-50' >{index + 1}</span>
                                                        <Avatar src={row.imageURL} alt='profile' />
                                                        <span className='text-lg font-bold' >{row.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="right">{row.floorPrice ?? "-"}</TableCell>
                                                <TableCell align="right">{row.volume ?? "-"}</TableCell>
                                                <TableCell align="right">{row?.totalItems ?? "-"}</TableCell>
                                                <TableCell style={{ borderTopRightRadius: 20, borderBottomRightRadius: 20, }} align="right">{row.owners ?? "-"}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    }
                </TableContainer>
            </Paper>
        </Box >
    );
}