import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { StoreData } from './apis/readContract';

export type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function AnchorTemporaryDrawer({ toggleDrawer, state, selectedItem: si} : {selectedItem?: StoreData, state: { bottom: boolean}, toggleDrawer: (arg: Anchor, arg1: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void}) {
  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 'auto'}}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      className="p-4 place-items-center space-y-4"
    >
      <Box className="text-md font-semibold">
        <h2 className="text-xl font-serif underline">Asset Information</h2>
        <div className="flex justify-between items-center">
          <h3>Contract address</h3>
          <h3>{si?.asset}</h3>
        </div>
        <div className="flex justify-between items-center">
          <h3>Asset Name</h3>
          <h3>{si?.metadata.name}</h3>
        </div>
        <div className="flex justify-between items-center">
          <h3>Ticker</h3>
          <h3>{si?.metadata.symbol}</h3>
        </div>
        <div className="flex justify-between items-center">
          <h3>Decimals</h3>
          <h3>{si?.metadata.decimals}</h3>
        </div>
      </Box>
      <Box>
        <h2 className="text-xl font-serif underline">Seller Info</h2>
        <h3>{si?.seller}</h3>
      </Box>
      <Box>
        <h2 className="text-xl font-serif underline">Store Info</h2>
        <div className="flex justify-between items-center">
          <h3>Available</h3>
          <h3>{si?.info.quantity.toString()}</h3>
        </div>
        <div className="flex justify-between items-center">
          <h3>Store ID</h3>
          <h3>{si?.info.storeId.toString()}</h3>
        </div>
      </Box>
      <Box className="px-4 ">
        <button className="bg-green-400 text-white rounded-sm text-sm p-2 float-right">Add To Cart</button>
      </Box>
    </Box>
  );

  return (
    <div>
      {(['bottom'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
