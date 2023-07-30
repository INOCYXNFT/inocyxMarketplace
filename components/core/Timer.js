import { useEffect, useState } from 'react'

const Timer = ({ date }) => {
  const [days, setDays] = useState()
  const [hours, setHours] = useState()
  const [minutes, setMinutes] = useState()
  const [seconds, setSeconds] = useState()

  useEffect(() => {
    var x = setInterval(function () {
      var now = Date.now()

      var distance = date - now + 30
      var d = Math.floor(
        ((date - now) / (1000 * 3600 * 24))
      )

      var h = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      var m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      var s = Math.floor((distance % (1000 * 60)) / 1000)

      setDays(d)
      setHours(h)
      setMinutes(m)
      setSeconds(s)

      if (distance < 0) {
        clearInterval(x)
      }
    }, 1000)
  }, [date])

  return days > 0 || hours > 0 || minutes > 0 || seconds > 0 ? (
    <div className="flex flex-row items-center justify-between w-full md:w-1/2">
      <div className='flex flex-col items-center justify-center'>
        <span className='md:text-lg text-md' >Days</span>
        <span className='md:text-5xl text-3xl font-bold font-sans' >{days}D</span>
      </div>
      <span className='md:text-5xl text-3xl font-bold font-sans mt-3' >:</span>
      <div className='flex flex-col items-center justify-center'>
        <span className='md:text-lg text-md' >Hours</span>
        <span className='md:text-5xl text-3xl font-bold font-sans' >{hours}H</span>
      </div>
      <span className='md:text-5xl text-3xl font-bold font-sans mt-3' >:</span>
      <div className='flex flex-col items-center justify-center'>
        <span className='md:text-lg text-md' >Minutes</span>
        <span className='md:text-5xl text-3xl font-bold font-sans' >{minutes}M</span>
      </div>
      <span className='md:text-5xl text-3xl font-bold font-sans mt-3' >:</span>
      <div className='flex flex-col items-center justify-center'>
        <span className='md:text-lg text-md' >Seconds</span>
        <span className='md:text-5xl text-3xl font-bold font-sans' >{seconds}S</span>
      </div>
    </div>
  ) : null
}

export default Timer
