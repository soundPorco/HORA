import React from "react";
import { useState } from "react";

// スライドアイコン
import { MdOutlineAutoAwesomeMotion } from "react-icons/md"; //メモ
import { MdBarChart } from "react-icons/md"; //グラフアイコン
import { MdEdit } from "react-icons/md"; //編集アイコン
import { MdPublic } from "react-icons/md"; //公開アイコン
import { MdLock } from "react-icons/md"; //ロックアイコン

const HelpModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // スライドデータ
    const helpSlides = [
        {
            icon: <MdOutlineAutoAwesomeMotion />,
            title: "HORAとは？",
            description:
                "HORAは、簡単にアンケートを作成し、回答を収集・分析できるツールです。",
        },
        {
            icon: <MdEdit />,
            title: "アンケートの作成",
            description:
                "直感的な操作で、質問や選択肢を自由に追加・編集できます。",
        },
        {
            icon: <MdBarChart />,
            title: "回答の収集",
            description:
                "回答をリアルタイムで収集し、結果を簡単に確認できます。",
        },
        {
            icon: <MdPublic />,
            title: "公開と共有",
            description:
                "アンケートを公開し、リンクを共有するだけで簡単に回答を集められます。",
        },
        {
            icon: <MdLock />,
            title: "安全なデータ管理",
            description:
                "収集したデータは安全に管理され、プライバシーを保護します。",
        },
    ];

    // 現在のスライドインデックスを管理
    const [currentSlide, setCurrentSlide] = useState(0);

    // 次のスライドへ移動
    const handleNext = () => {
        if (currentSlide < helpSlides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else if (currentSlide === helpSlides.length - 1) {
            onClose(); // 最後のスライドで「次へ」をクリックしたらモーダルを閉じる
        }
    };

    // 進行度の計算
    const progress = ((currentSlide + 1) / helpSlides.length) * 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-[90%] max-w-md relative">
                <button
                    className="absolute top-4 right-6 text-xl text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                >
                    ×
                </button>

                {/* スライドコンテイナー */}
                <div className="text-center mt-[60px] mb-6 px-10">
                    <div className="text-5xl mb-4 *:text-blue-500 bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto p-7">
                        {helpSlides[currentSlide].icon}
                    </div>
                    <h2 className="text-xl font-bold mb-4">
                        {helpSlides[currentSlide].title}
                    </h2>
                    <p className="text-gray-700 mb-4">
                        {helpSlides[currentSlide].description}
                    </p>
                </div>

                {/* プログレスバー */}
                <div className="w-full bg-gray-300 h-2 rounded-full mb-6">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* 次へボタン */}
                <button
                    onClick={handleNext}
                    disabled={currentSlide === helpSlides.length - 1}
                    className="px-4 py-2 mt-6 rounded w-full duration-150 
                        bg-blue-500 text-white hover:bg-blue-600"
                >
                    {currentSlide === helpSlides.length - 1 ? "閉じる" : "次へ"}
                </button>
            </div>
        </div>
    );
};

export default HelpModal;
