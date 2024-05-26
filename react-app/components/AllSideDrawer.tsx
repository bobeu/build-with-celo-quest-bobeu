import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { Navigator } from './Footer';
import { ToggleDrawer, SectionId, ScrollToSection, DrawerState } from './apis/readContract';

export default function AllSideDrawer({ activeLink, scrollToSection, drawerState, toggleDrawer, children} : {children: React.ReactNode, activeLink: SectionId, scrollToSection: ScrollToSection, drawerState: DrawerState, toggleDrawer: ToggleDrawer}) {
  
  return (
    <div>
      {(['left', 'right', 'top', 'bottom'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={drawerState[anchor]}
            onClose={toggleDrawer(anchor, false, "")}
          >
            {
              (anchor === "bottom") && <>
                <Navigator scrollToSection={scrollToSection} activeLink={activeLink} />
                <Divider />
              </>
            }
            { children }
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

    // <div>
    //   <Drawer
    //     anchor={"bottom"}
    //     open={drawerState}
    //     onClose={toggleDrawer(false, "")}
    //   >
        // {
        //   showNavigator && <>
        //     <Navigator scrollToSection={scrollToSection} activeLink={activeLink} />
        //     <Divider />
        //   </>
        // }
        // { children }
    //   </Drawer>
    // </div>