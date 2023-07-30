import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Chip } from '@mui/material';
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
import Router from 'next/router';
import { TRANSACTION_ENDPOINT } from '../../constants';
import LaunchIcon from '@mui/icons-material/Launch';
import { truncateAddress } from '../../utility';
import moment from 'moment';
import { ArrangeVerticalCircle, Ethereum, Shapes1, Tag } from 'iconsax-react';
function createData(name, event, from, to, price, time, hash) {
  return {
    name,
    event,
    from,
    to,
    price,
    time,
    hash
  };
}

const rows = [
  createData('Cupcake', "Listing", "0x134F0E59cdE1E76a5F7e057c05636a33a4Bd9c74", "0x134F0E59cdE1E76a5F7e057c05636a33a4Bd9c74", 1684242967808, 4.3),
  createData('Donut', "Transfer", "0x134F0E59cdE1E76a5F7e057c05636a33a4Bd9c74", "0x134F0E59cdE1E76a5F7e057c05636a33a4Bd9c74", 1684242967808, 2.5),
  createData('Eclair', "Purchase", "0x134F0E59cdE1E76a5F7e057c05636a33a4Bd9c74", "0x134F0E59cdE1E76a5F7e057c05636a33a4Bd9c74", 1684242967808, 2.5)
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
    id: 'Item',
    numeric: false,
    disablePadding: false,
    label: 'Item',
  },
  {
    id: 'event',
    numeric: false,
    disablePadding: false,
    label: 'Event',
  },
  {
    id: 'from',
    numeric: true,
    disablePadding: false,
    label: 'From',
  },
  {
    id: 'to',
    numeric: true,
    disablePadding: false,
    label: 'To',
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'Price',
  },
  {
    id: 'time',
    numeric: true,
    disablePadding: false,
    label: 'Transaction date',
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
            {headCell.label}
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

export default function ActivityTable(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const collections = props?.collections

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

  // const handleClick = (event, id) => {
  //     Router.push(`/collections/${id}`)
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage],
  );
  const Filters = [
    {
      name: "All",
      type: "",
      icon: ''
    },
    {
      name: "Mint",
      type: "mint",
      icon: <Shapes1 />
    },
    {
      name: "Trade",
      type: "trade",
      icon: <ArrangeVerticalCircle />
    },
    {
      name: "List",
      type: "list",
      icon: <Tag />
    },
    {
      name: "Buy",
      type: "buy",
      icon: <Ethereum />
    },
  ]
  const { loading, data, transactionType, setTransactionType } = props;

  return (
    <Box sx={{ width: '100%', border: "1px solid #E1E1E126", padding: 1, borderRadius: 5 }}>
      <div className="flex flex-row flex-wrap w-full gap-2" >
        {Filters.map((filter) => (
          <Chip
            clickable
            variant={transactionType === filter.type ? "outlined" : "filled"}
            className="bg-white/10 p-2"
            icon={filter.icon}
            label={filter.name}
            onClick={() => setTransactionType(filter.type)}
          />
        ))}
      </div>
      <Paper sx={{ width: '100%', mb: 2, mt: 2, background: "transparent", border: "none" }}>
        <TableContainer style={{ width: "100%" }}>
          {data?.length === 0 ?
            <div className='flex items-center justify-center w-full' >
              <EmptyState description="No activity found" />
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
                  data?.map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        // onClick={(event) => handleClick(event, row.collectionID)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        className='font-sans'
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer', borderRadius: 20 }}
                      >
                        {/* <TableCell
                          component="th"
                          style={{ borderTopLeftRadius: 20, borderBottomLeftRadius: 20, }}
                          id={labelId}
                          scope="row"
                          padding="16"
                        >
                          <div className='gap-2 flex flex-row items-center font-sans'>
                            <span className='mr-4 opacity-50' >{index + 1}</span>
                            <Chip className='uppercase' label={row.transactionType} />
                          </div>
                        </TableCell> */}
                        <TableCell
                          component="th"
                          style={{ borderTopLeftRadius: 20, borderBottomLeftRadius: 20, }}
                          id={labelId}
                          scope="row"
                          padding="16"
                        >
                          <div className='gap-2 flex flex-row items-center font-sans'>
                            <span className='mr-4 opacity-50' >{index + 1}</span>
                            <Avatar src={row.nft?.itemImage} alt='profile' />
                            <span className='text-lg font-bold' >{row.nft?.itemName}</span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          <Chip className='uppercase' label={row.transactionType} />
                        </TableCell>
                        <TableCell align="right">{row?.owner?.displayName ?? "-"}</TableCell>
                        <TableCell align="right">{row?.buyer?.displayName ?? "-"}</TableCell>
                        <TableCell align="right">{row?.price}</TableCell>
                        <TableCell style={{ borderTopRightRadius: 20, borderBottomRightRadius: 20, }} align="right">
                          <Link target='_blank' href={`${TRANSACTION_ENDPOINT}/tx/${row?.hash}`} >
                            {moment(new Date(parseInt(row.createdAt))).format('DD/MM/YYYY, hh:mm A')} <LaunchIcon fontSize='12' />
                          </Link>
                        </TableCell>
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