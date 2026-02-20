/** @type {import('tailwindcss').Config} */

export default {
    // 以下の content 配列に、Tailwind CSS を適用したいファイルのパスを追加
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                Oswald: ["Oswald", "sans-serif"],
            },
            animation: {
                blink: "blink 2s infinite", // アニメーション名と継続時間
            },
            keyframes: {
                blink: {
                    "0%, 100%": { color: "#b60000" }, // 開始と終了時の色
                    "50%": { color: "#ff0000" }, // 中間の色
                },
            },
        },
    },
    plugins: [],
};
