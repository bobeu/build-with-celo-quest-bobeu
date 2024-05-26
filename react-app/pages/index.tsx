import React from "react";
import { useAccount } from "wagmi";
import Container from "@mui/material/Container";
import { Home as HomePage } from "@/components/Home";
import { InitStorage } from "@/components/apis/readContract";
import type { Storage, StoreData, SectionId, Anchor, ItemInfo, ContentType, CoinCategory } from "@/components/apis/readContract";
import Layout from "@/components/Layout";
import Notification from "@/components/Notification";
import Sell from "@/components/Sell";

export default function Home() {
    const [ userAddress, setUserAddress] = React.useState<string>("");
    // const [ , refresh] = React.useState<number>();
    const [ message, setMessage] = React.useState<string>("");
    const [ activeLink, setActiveLink ] = React.useState<SectionId>("Home");
    const [ items, setItems ] = React.useState<StoreData[]>([]);
    const [ drawerState, setState ] = React.useState<{ top: boolean; left: boolean; bottom: boolean; right: boolean;}>({ top: false, left: false, bottom: false, right: false,});
    const [ contentType, setContentType] = React.useState<ContentType>("");
    const [ selectedItem, setSelectedItem] = React.useState<StoreData>(new InitStorage().mockStorage.stores[0]);
    const [ searchResult, setSearchResult ] = React.useState<string>("");
    const [ coinCategory, setCoinCategory ] = React.useState<string>("");
    const [ storage, setStorage ] = React.useState<Storage>(new InitStorage().mockStorage);
    const { address, isConnected } = useAccount();
    
    const scrollToSection = (sectionId: SectionId) => {
        setActiveLink(sectionId);
        // const sectionElement = document.getElementById(sectionId);
        // const offset = 128;
        // if (sectionElement) {
        //     const targetScroll = sectionElement.offsetTop - offset;
        //     sectionElement.scrollIntoView({ behavior: 'smooth' });
        //     window.scrollTo({
        //         top: targetScroll,
        //         behavior: 'smooth',
        //     });
        // }
    };

    const addToCart = (item: StoreData) => {
        if(!items.includes(item)) {
            setItems((prev) => [...prev, item]);
            setMessage(`${item.metadata.symbol} added to the list`);
        }
    }

    const removeFromCart = (item: StoreData) => {
        const filtered = items?.filter((j) => j.metadata.name !== item.metadata.name);
        setItems(filtered);
        setMessage(`${item.metadata.symbol} removed from the list`);
    }

    const handleButtonClick = (arg: string) => {
        if(arg === "ALL") {
            setCoinCategory("");
        } else {
            setCoinCategory(arg);
        }
    }; 

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const value = e.currentTarget.value;
        setSearchResult(value);
    } 

    const toggleDrawer =
    (anchor: Anchor, open: boolean, cType: ContentType, item?: StoreData) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...drawerState, [anchor]: open });
      setContentType(cType);
      item && setSelectedItem(item);
    };

    React.useEffect(() => {
        if (isConnected && address) {
            setUserAddress(address);
        }
    }, [address, isConnected]);

    const sections : {id: SectionId, element: JSX.Element}[] = [
        {
            id: "Home",
            element: <HomePage { ...{activeLink, addToCart, drawerState, contentType, items, mockStorage: storage, scrollToSection, selectedItem, toggleDrawer, searchResult, removeFromCart, handleButtonClick}} coinCategory={coinCategory} />
        },
        {
            id: "Sell",
            element: <Sell { ...{supportedAssets: storage.supportedAssets, } } />
        },
    ]

    return (
        <Layout
            footerProps={{activeLink, scrollToSection}}
            headerProps={{activeLink, items, scrollToSection, toggleDrawer, handleSearch }}
        >
            <Container maxWidth={"lg"}>
                {
                    sections.map(({ id, element }) => (
                        <section key={id} id={id} hidden={activeLink !== id}>
                            { element }
                        </section>
                    ))
                }
                <Notification message={message} />
            </Container>
        </Layout>
    );
}
