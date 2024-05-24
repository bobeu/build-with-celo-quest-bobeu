import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Container from "@mui/material/Container";
import { Home as HomePage } from "@/components/Home";
import { InitStorage, Storage } from "@/components/apis/readContract";
import { SectionId } from "@/components/Footer";

export default function Home() {
    const [userAddress, setUserAddress] = useState<string>("");
    const [ searchText, setSearchText ] = useState<string>("");
    const { address, isConnected } = useAccount();
    const [ storage, setStorage ] = useState<Storage>(new InitStorage().mockStorage);

    useEffect(() => {
        if (isConnected && address) {
            setUserAddress(address);
        }
    }, [address, isConnected]);

    const sections : {id: SectionId, element: JSX.Element}[] = [
        {
            id: "Home",
            element: <HomePage { ...{mockStorage: storage, searchText} } />
        },
    ]

    return (
        <Container maxWidth={"lg"}>
            {
                sections.map(({ id, element }) => (
                    <section key={id} id={id}>
                        { element }
                    </section>
                ))
            }
        </Container>
    );
}
