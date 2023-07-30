import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import LaunchIcon from '@mui/icons-material/Launch'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Link from 'next/link'
import { TablePagination } from '@mui/material'

function createData(price, inr, floor, expire, from, scan) {
  return { price, inr, floor, expire, from, scan }
}

const data = [
  createData(
    0.24,
    '$433.49',
    '36% above',
    "about 32 hours",
    '0xC129b5D4b90Efa9eC1A22D0e675A3124CE88b546',
    'https://polygonscan.com/address/0xc0bb3eda48a61bab8f29cd1e8c0eea31b2cbc9ff',
  ),
  createData(
    0.24,
    '$433.49',
    '36% above',
    "about 32 hours",
    '0xC129b5D4b90Efa9eC1A22D0e675A3124CE88b546',
    'https://polygonscan.com/address/0xc0bb3eda48a61bab8f29cd1e8c0eea31b2cbc9ff',
  ),
  createData(
    0.24,
    '$433.49',
    '36% above',
    "about 32 hours",
    '0xC129b5D4b90Efa9eC1A22D0e675A3124CE88b546',
    'https://polygonscan.com/address/0xc0bb3eda48a61bab8f29cd1e8c0eea31b2cbc9ff',
  ),
  createData(
    0.24,
    '$433.49',
    '36% above',
    "about 32 hours",
    '0xC129b5D4b90Efa9eC1A22D0e675A3124CE88b546',
    'https://polygonscan.com/address/0xc0bb3eda48a61bab8f29cd1e8c0eea31b2cbc9ff',
  ),
  createData(
    0.24,
    '$433.49',
    '36% above',
    "about 32 hours",
    '0xC129b5D4b90Efa9eC1A22D0e675A3124CE88b546',
    'https://polygonscan.com/address/0xc0bb3eda48a61bab8f29cd1e8c0eea31b2cbc9ff',
  ),
  createData(
    0.24,
    '$433.49',
    '36% above',
    "about 32 hours",
    '0xC129b5D4b90Efa9eC1A22D0e675A3124CE88b546',
    'https://polygonscan.com/address/0xc0bb3eda48a61bab8f29cd1e8c0eea31b2cbc9ff',
  ),

]

export default function Offers({setOffer, setOfferModal}) {
  const [page, setPage] = React.useState(0)
  const [rows, setRows] = React.useState(5)
  return (
    <>
    <div className='w-full flex-1 bg-black/20 flex flex-row items-center justify-center h-[100%] backdrop-blur-md absolute top-0 z-40' >
      <p className='text-5xl font-bold' >Coming soon</p>
    </div>
    <TableContainer component={Paper} className="rounded-xl">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead className="bg-gray-800">
          <TableRow>
            <TableCell>Price</TableCell>
            <TableCell align="center">USB Price</TableCell>
            <TableCell align="center">Floor Difference</TableCell>
            <TableCell align="center">Expiration</TableCell>
            <TableCell align="center">From</TableCell>
            <TableCell align="center">Polygon Scan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} hover className={`cursor-pointer hover:brightness-125 ${index % 2 ? "bg-black" : "bg-gray-900"}`} >
              <TableCell align="center" onClick={() => {setOffer(row); setOfferModal(true)}}>
                <div className="p-2 rounded-xl bg-green-400/80 text-black text-center">
                  {row.price} Matic
                </div>
              </TableCell>
              <TableCell align="center">{row.inr}</TableCell>
              <TableCell align="center">{row.floor}</TableCell>
              <TableCell align="center">{row.expire}</TableCell>
              <TableCell align="center">{row.from}</TableCell>
              <TableCell align="center">
              <Link href={row.scan} target="_blank" rel="noreferrer">
                  <LaunchIcon className="cursor-pointer" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rows}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setRows(parseInt(e.target.value, 10))}
        />
    </TableContainer>
    </>
  )
}
