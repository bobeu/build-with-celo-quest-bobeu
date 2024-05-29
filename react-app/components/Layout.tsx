import React, { FC, ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Container from "@mui/material/Container";
import type { FooterProps, HeaderProps } from "./apis/readContract";

interface LayoutProps {
    children: ReactNode;
    headerProps: HeaderProps;
    footerProps: FooterProps;
}
const Layout: FC<LayoutProps> = ({ children, headerProps, footerProps }) => {
    return (
        <React.Fragment>
            <div className="bg-gypsum overflow-auto flex flex-col h-screen">
                <Header { ...headerProps } />
                <Container maxWidth="lg" className="mx-auto py-4 bg-green-50 h-full ">
                    {children}
                </Container>
                <Footer { ...footerProps } />
            </div>
        </React.Fragment>
    );
};

export default Layout;
