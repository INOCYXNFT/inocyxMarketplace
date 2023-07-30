// import React, {memo} from 'react';
// import {  Column, Line } from '@ant-design/plots';

// const Stats = () => {
//   const data = [
//     { year: '1991', value: 3 },
//     { year: '1992', value: 4 },
//     { year: '1993', value: 3.5 },
//     { year: '1994', value: 5 },
//     { year: '1995', value: 4.9 },
//     { year: '1996', value: 6 },
//     { year: '1997', value: 7 },
//     { year: '1998', value: 9 },
//     { year: '1999', value: 13 },
//   ];

//   const config = {
//     data,
//     width: 600,
//     height: 400,
//     autoFit: false,
//     xField: 'year',
//     yField: 'value',
//     point: {
//       size: 5,
//       shape: 'diamond',
//     },
//     color: 'orange',
//     label: {
//       style: {
//         fill: '#aaa',
//       },
//     },
//   };

//   return (
//     <>
//     <div className='w-full flex-1 bg-black/20 flex flex-row items-center justify-center h-[100%] backdrop-blur-md absolute top-0 z-40' >
//       <p className='text-5xl font-bold' >Coming soon</p>
//     </div>
//     <div className="flex md:flex-row flex-col p-4 items-center justify-center" >
//       <div className='bg-gray-300/10 p-4 md:mr-10 mt-4 rounded-xl' ><Line {...config}  />
//       </div>
//       <div className='bg-gray-300/10 p-4 md:mr-10 mt-4 rounded-xl' ><Column {...config}  />
//       </div>
//     </div>
//     </>
//   );
// };
// export default memo(Stats);