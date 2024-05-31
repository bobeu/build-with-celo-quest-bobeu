import * as React from 'react';
import Stack from '@mui/material/Stack';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Image from 'next/image';

export interface CardItemProps {
    height?: number;
    width?: number;
    imageUrl: string;
    imageAlt: string;
    option1?: string;
    option2?: React.ReactNode;
    handleClick: (arg?: string) => void;
}

export default function CardItem(props: CardItemProps) {
    const { height, width, imageUrl, handleClick, imageAlt, option1, option2 } = props;
    return (
        // bg-black bg-opacity-90 rounded-lg p-4 md:p-12 bg-[url('/freepicks.svg')] bg-cover bg-no-repeat bg-blend-color-burn text-blue-200 font-black md:text-3xl
        <Stack 
            onClick={() => handleClick(option1)}
            className="place-items-center cursor-pointer p-4 h-[90px] text-xs font-semibold hover:bg-green-100 hover:text-orange-600 active:bg-green-200 active:text-orange-600"
        >
            <Image 
                src={imageUrl}
                alt={imageAlt}
                width={width || 60}
                height={height || 60}
                style={{borderRadius: "22px", width: "auto", height: "auto"}}
            />
            <h3>{option1}</h3>
            { option2 && <h3>{option2}</h3> }
        </Stack>
    );
}

