import React from 'react';
import { Overlay } from './Overlay';


export const CalendarItem = ({ item }: {
    item: {
        number: string;
        title: string;
        text: string;
        uri: string;
    };
}) => {

    //window.localStorage() bitmaske
    const [visible, setVisible] = React.useState(false);
    const [backgroundColor, setBackgroundColor] = React.useState("rgba(217, 30, 24,0.5)")


    //const isActive = Number(item.number) <= new Date().getDate() && new Date().getMonth() === 10
    const isActive = Number(item.number) <= 17

    const onPressItem = () => {
        if (isActive) {
            setVisible(!visible);
        }
    };

    const [windowWidth, setWindowWidth] = React.useState(0);
    React.useEffect(() => {
        const width = window.innerWidth
        setWindowWidth(width)
    }, [])


    React.useEffect(() => {
        if (isActive) {
            setBackgroundColor("rgba(172, 246, 200, 0.5)")
        } else {
            setBackgroundColor("rgba(217, 30, 24,0.5)")
        }
    }, [isActive, item.number])

    const highlightedNumbers = ["4", "12", "20"]

    const borderStyle = highlightedNumbers.includes(item.number) && {
        borderColor: "lightgray",
        borderStyle: "solid",
        borderWidth: 2,
    }


    return <>
        <div onClick={onPressItem} style={{
            minWidth: 50,
            minHeight: 50,
            maxHeight: 100,
            maxWidth: 100,
            width: windowWidth > 415 ? 100 : 70,
            height: windowWidth > 415 ? 100 : 70,
            margin: 6,
            display: "flex",
            alignItems: "center",
            backgroundColor,
            justifyContent: "center",
            borderRadius: 12,
            ...borderStyle
        }}>
            <h2>{item.number}</h2>
        </div>
        <Overlay visible={visible} item={item} setVisible={setVisible} />
    </>;
};
