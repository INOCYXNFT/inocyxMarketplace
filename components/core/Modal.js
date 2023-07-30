import { Transition } from '@headlessui/react'
import { Close } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import { cloneElement, memo, useEffect } from 'react'

const Modal = (props) => {
  const { open, handleClose, children, closable, backdropClosable } = props;
  useEffect(() => {
    function handleEscape(e) {
      if (e.keyCode === 27 && handleClose) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleEscape)

    if (!open) document.body.style.overflow = "auto"
    else if (open) {
      document.body.style.overflow = "hidden"
      window.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <Transition
      show={Boolean(open)}
      style={{ zIndex: 9999 }}
      className="transform transition fixed flex flex-col items-center justify-center top-0 left-0 w-full h-full z-50"
      enter=" duration-400 ease-out"
      enterFrom=" scale-95 opacity-0"
      enterTo="scale-100 opacity-100"
      leave="duration-400 ease-out"
      leaveFrom="scale-100 opacity-100"
      leaveTo="scale-95 opacity-0"
    >
      <>
        <div
          className="fixed bg-forground/80 flex flex-col items-center justify-center top-0 left-0 w-full h-full z-0"
          onClick={() => { backdropClosable ? handleClose(!open) : {} }}
        />
        {cloneElement(children, { open, handleClose, closable, backdropClosable })}
        {closable ? <IconButton className='text-white absolute top-0 right-0  m-4  ' onClick={() => handleClose(false)}>
          <div className='border-[1px] border-white/20 px-3 py-1.5 rounded-full'>
            <Close />
          </div>
        </IconButton> : null}
      </>
    </Transition>
  )
}

export default memo(Modal)

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  closable: PropTypes.bool,
  backdropClosable: PropTypes.bool
}

Modal.defaultProps = {
  closable: true,
  backdropClosable: true
}
