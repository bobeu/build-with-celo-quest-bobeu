import { FC, ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Container from "@mui/material/Container";
import { FooterProps, HeaderProps } from "./apis/readContract";

interface Props {
    children: ReactNode;
    headerProps: HeaderProps;
    footerProps: FooterProps;
}
const Layout: FC<Props> = ({ children, headerProps, footerProps }) => {
    return (
        <>
            <div className="bg-gypsum overflow-hidden flex flex-col min-h-screen">
                <Header { ...headerProps } />
                <Container maxWidth="lg" className="mx-auto py-4 bg-green-50 w-full p-1 rounded-lg h-full ">
                    {children}
                </Container>
                <Footer { ...footerProps } />
            </div>
        </>
    );
};

export default Layout;
