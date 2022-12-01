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
        <div style={{ width: "80%", height: "70%", maxHeight: 500, backgroundColor: "#828282cd", borderRadius: 12, padding: 24, overflowY: "scroll", borderColor: "white", borderWidth: 22 }}>
            <h2 style={{ color: "white" }}>{item.number}</h2>
            <div style={{ color: "white" }} dangerouslySetInnerHTML={{ __html: item.text }} />
        </div>
    </div>;
};
