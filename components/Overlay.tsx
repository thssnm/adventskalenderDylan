import React from 'react';

export const Overlay = ({ item, visible, setVisible }: {
    item: {
        number: string;
        title: string;
        text: string;
        uri: string;
    }; visible: boolean; setVisible: (value: boolean) => void;
}) => {
    if (!visible) {
        return null;
    }
    return <div onClick={() => setVisible(false)} style={{
        backgroundColor: "rgba(0,0,0,0.8)",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }}
    >
        <div style={{ width: 300, height: 300, backgroundColor: "white", borderRadius: 12 }}>
            <h2 style={{ color: "black" }}>{item.number + ". " + item.title}</h2>
            <p style={{ color: "black" }}>{item.text}</p>
        </div>
    </div>;
};
