import { FC, ReactNode, useState } from "react";
import Footer, { SectionId } from "./Footer";
import Header from "./Header";
import Container from "@mui/material/Container";

interface Props {
    children: ReactNode;
}
const Layout: FC<Props> = ({ children }) => {
    const [ activeLink, setActiveLink ] = useState<SectionId>("Home");

    const scrollToSection = (sectionId: SectionId) => {
        setActiveLink(sectionId);
        const sectionElement = document.getElementById(sectionId);
        const offset = 128;
        if (sectionElement) {
            const targetScroll = sectionElement.offsetTop - offset;
            sectionElement.scrollIntoView({ behavior: 'smooth' });
            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth',
            });
        }
    };

    return (
        <>
            <div className="bg-gypsum overflow-hidden flex flex-col min-h-screen">
                <Header { ...{scrollToSection, activeLink} } />
                {/* <div className="py-16 max-w-7xl mx-auto space-y-8 sm:px-6 lg:px-8"> */}
                <Container maxWidth="lg" className="mx-auto py-4 bg-green-50 w-full p-1 rounded-lg h-full ">
                    {children}
                </Container>
                <Footer { ...{scrollToSection, activeLink} } />
            </div>
        </>
    );
};

export default Layout;
