import { ButtonBase, ClickAwayListener, Tooltip } from '@mui/material'
import { FileCopyOutlined } from '@mui/icons-material'
import { useState } from 'react';
import Zoom from '@mui/material/Zoom';
import Image from "next/image";

function CopyContent(props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(props.content === 'href' ? window.location.href : props.content)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return <ClickAwayListener onClickAway={() => setCopied(false)} >
    <ButtonBase className="mx-1 rounded-lg  p-4 bg-white/5 font-sans text-sm transition-all hover:bg-white/20" >
      <Tooltip
        PopperProps={{
          disablePortal: true,
        }}
        arrow
        TransitionComponent={Zoom}
        open={copied}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title="Copied"
        placement="top"
      >
        <button onClick={handleCopy}>
          {/* <FileCopyOutlined className='text-[18px]' /> */}
          <Image 
            src="/copy.svg"
            alt='copy'
            width={28}
            height={28}
            className="w-auto h-auto"
          />
        </button>
      </Tooltip>
    </ButtonBase>
  </ClickAwayListener>
}

export default CopyContent
