import React from "react";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "8px", // 角丸
                    padding: "10px",
                    fontSize: "12px", // サイズを小さく
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                }}
            >
                <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
                {payload.map((item, index) => (
                    <p key={index} style={{ margin: 0 }}>
                        {item.name}: {item.value}
                    </p>
                ))}
            </div>
        );
    }

    return null;
};

export default CustomTooltip;
