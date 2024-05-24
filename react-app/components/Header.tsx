import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import Image from "next/image";
import { useEffect, useState } from "react";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { SectionId, navigator } from "./Footer";
import { Searchbar } from "./Searchbar";
import { Dropdown } from "./Dropdown";
import Stack from "@mui/material/Stack";

export default function Header(props: {scrollToSection: (arg: SectionId) => void, activeLink: SectionId}) {
    const [hideConnectBtn, setHideConnectBtn] = useState(false);
    const { connect } = useConnect();
    const { scrollToSection, activeLink } = props;

    useEffect(() => {
        if (window.ethereum && window.ethereum.isMiniPay) {
            setHideConnectBtn(true);
            connect({ connector: injected({ target: "metaMask" }) });
        }
    }, []);

    return (
        <Disclosure as="nav" className="bg-orange-400 border-b border-black h-[fit-content] md:h-full">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 justify-between">

                            <div className="flex flex-1 items-center justify-start sm:items-stretch md:justify-center">
                                <div className="flex flex-shrink-0 items-center">
                                    {/* <Image
                                        className="block h-8 w-auto sm:block lg:block"
                                        src="/logo.svg"
                                        width="24"
                                        height="24"
                                        alt="Celo Logo"
                                    /> */}
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
                        </div>
                    </div>

                    <Stack className="place-items-center space-y-2 text- text-white ">
                        <h3>{"Which asset are you looking for?"}</h3>
                        <div className="w-full flex justify-between p-2 gap-2">
                            <Dropdown />
                            <Searchbar />
                        </div>
                    </Stack>
                </>
            )}
        </Disclosure>
    );
}
