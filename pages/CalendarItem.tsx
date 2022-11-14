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

    //let opened: string[] =   window?.localStorage["opened"] && JSON.parse(window?.localStorage["opened"])
    const style = Number(item.number) <= new Date().getDate() ? "green" : "red";
    return <>
        <div onClick={onPressItem} style={{
            width: 100,
            height: 100,
            margin: 12,
            display: "flex",
            alignItems: "center",
            backgroundColor: style,
            justifyContent: "center",
            borderRadius: 12,
        }}>
            <h2>{item.number}</h2>
        </div>
        {/* <Snowfall /> */}
        <Overlay visible={visible} item={item} setVisible={setVisible} />
    </>;
};
