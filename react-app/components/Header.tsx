import { Disclosure } from "@headlessui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useConnect, useAccount } from "wagmi";
import { injected } from "wagmi/connectors";
import { navigator } from "./Footer";
import { Searchbar } from "./Searchbar";
import { Dropdown } from "./Dropdown";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import type { ToggleDrawer, ScrollToSection, SectionId, HeaderProps, ItemInfo, CartItem } from "./apis/readContract";

export default function Header(props: { items: CartItem[], activeLink: SectionId, scrollToSection: ScrollToSection, toggleDrawer: ToggleDrawer, handleSearch: (arg: React.ChangeEvent<HTMLInputElement>) => void}) {
    const [hideConnectBtn, setHideConnectBtn] = useState(false);
    const { connect } = useConnect();
    const { isConnected } = useAccount();
    const { scrollToSection, activeLink, toggleDrawer, items, handleSearch } = props;

    useEffect(() => {
        connect({ connector: injected({ target: "metaMask" }) });
        if (window.ethereum && window.ethereum.isMiniPay) {
            setHideConnectBtn(true);
            connect({ connector: injected({ target: "metaMask" }) });
        }
    }, []);
    

    return (
        <Disclosure as="nav" className="bg-orange-400 border-b border-black h-[fit-content] md:h-full">
            {() => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 justify-between">

                            <div className="flex flex-1 items-center justify-start sm:items-stretch md:justify-center">
                                <div className="flex flex-shrink-0 items-center">
                                    <span className="text-stone-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                        </svg>
                                    </span>
                                    <h3 className="text-lg font-bold text-stone-700">Coinpicker</h3>
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8 mx-auto md:flex items-center justify-between">
                                    {
                                        navigator.map(({text }) => (
                                            <button key={text} className={`w-full text-white place-items-center text-sm cursor-pointer ${activeLink === text && "bg-white text-green-500 font-bold rounded-lg p-2 "}`} onClick={() => scrollToSection(text)}>
                                                <h3>{ text }</h3>
                                            </button>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="hidden md:flex absolute inset-y-0 right-0 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {!hideConnectBtn && (
                                    <ConnectButton
                                        showBalance={{
                                            smallScreen: true,
                                            largeScreen: false,
                                        }}
                                    />
                                )}
                            </div>
                            <div className="float-right flex flex-shrink-0 items-center">
                                <h3 className="absolute right-1 text-xs text-orange-200 font-bold">{items?.length}</h3>
                                <button className="text-white rounded-full bg-stone-800 p-3" onClick={toggleDrawer("bottom", true, "cartContent")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <Stack className="place-items-center space-y-2 text- text-white ">
                        <div>{isConnected && <ConnectButton />}</div>
                        <h3>{"Which asset are you looking for?"}</h3>
                        <Box className="flex justify-between items-center py-2 px-4 gap-2">
                            <Dropdown toggleDrawer={toggleDrawer} />
                            <Searchbar handleSearch={handleSearch} />
                        </Box>
                    </Stack>
                </>
            )}
        </Disclosure>
    );
}
