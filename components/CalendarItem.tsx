import React from 'react';
import { Overlay } from './Overlay';


export const CalendarItem = ({ item, count }: {
    item: {
        number: string;
        title: string;
        text: string;
    }, count: number
}) => {

    //window.localStorage() bitmaske
    const [visible, setVisible] = React.useState(false);
    const [backgroundColor, setBackgroundColor] = React.useState("rgba(217, 30, 24,0.5)")
    const [pointerEvents, setPointerEvents] = React.useState<"auto" | "none" | "visiblePainted" | "visibleFill" | "visibleStroke" | "visible" | "painted" | "fill" | "stroke" | "all" | "inherit">("none")


    const isActive = (Number(item.number) <= new Date().getDate() && new Date().getMonth() === 11) || count > 9
    //const isActive = Number(item.number) <= 17 || count > 19

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
            setBackgroundColor("rgba(172, 246, 200, 0.7)")
            setPointerEvents("auto")
        } else {
            setBackgroundColor("rgba(217, 30, 24,0.7)")
            setPointerEvents("none")
        }
    }, [isActive, item.number])

    const highlightedNumbers = ["10", "15", "18", "19", "20", "22", "23", "24"]

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
            width: windowWidth > 444 ? 80 : windowWidth > 500 ? 100 : 65,
            height: windowWidth > 444 ? 80 : windowWidth > 500 ? 100 : 65,
            margin: 6,
            display: "flex",
            alignItems: "center",
            backgroundColor,
            justifyContent: "center",
            borderRadius: 12,
            cursor: "pointer",
            pointerEvents,
            ...borderStyle
        }}>
            <h2 style={{ color: "white" }}>{item.number}</h2>
        </div>
        <Overlay visible={visible} item={item} setVisible={setVisible} />
    </>;
};
