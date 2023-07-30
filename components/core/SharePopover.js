import * as React from 'react';
import { Popover, ButtonBase } from '@mui/material';


export default function SharePopover({ label, children }) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <ButtonBase className="rounded-full">
                <div className="flex flex-row items-center gap-3 border-[1px] border-white/40 px-4 p-2 rounded-full text-white" onClick={handleClick}>
                    <span className='text-sm'>{label}</span>
                </div>
            </ButtonBase>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                style={{ padding: 10 }}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {children}
            </Popover>
        </div>
    );
}