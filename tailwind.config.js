/** @type {import('tailwindcss').Config} */
export default {
    // 以下の content 配列に、Tailwind CSS を適用したいファイルのパスを追加
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
};
