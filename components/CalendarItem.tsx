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
    /*   let opened: string[] = undefined
      if (typeof window !== "undefined") {
        opened = JSON.parse(window?.localStorage["opened"])
      } */
    const onPressItem = () => {
        if (Number(item.number) <= new Date().getDate()) {
            setVisible(!visible);
            //window.localStorage["opened"] = JSON.stringify([...JSON.parse(window.localStorage["opened"] || "[]"), item.number])
        }
    };

    const [windowWidth, setWindowWidth] = React.useState(0);
    React.useEffect(() => {
        const width = window.innerWidth
        setWindowWidth(width)
    }, [])


    //let opened: string[] =   window?.localStorage["opened"] && JSON.parse(window?.localStorage["opened"])
    const backgroundColor = Number(item.number) <= new Date().getDate() ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.3)";
    return <>
        <div onClick={onPressItem} style={{
            minWidth: 70,
            minHeight: 70,
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
        }}>
            <h2>{item.number}</h2>
        </div>
        {/* <Snowfall /> */}
        <Overlay visible={visible} item={item} setVisible={setVisible} />
    </>;
};
