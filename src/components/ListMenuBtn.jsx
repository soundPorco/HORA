import { useState } from "react";
import { FiEdit, FiBarChart2, FiTrash2 } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";

const MenuButton = ({ onEdit, onResult, onDelete }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            {/* 三点ボタン */}
            <button
                onClick={() => setOpen(!open)}
                className="w-8 h-8 flex items-center justify-center rounded-full
                           text-gray-500 hover:bg-gray-200 hover:text-gray-800
                           transition text-xl"
            >
                <HiDotsVertical />
            </button>

            {/* メニュー */}
            {open && (
                <ul
                    className="absolute right-0 mt-2 w-32 bg-white border rounded-lg
                               shadow-lg text-sm overflow-hidden z-10"
                >
                    <li
                        onClick={() => {
                            onEdit();
                            setOpen(false);
                        }}
                        className="px-3 py-2 flex items-center gap-2
                                   hover:bg-gray-100 cursor-pointer"
                    >
                        <FiEdit />
                        編集
                    </li>

                    <li
                        onClick={() => {
                            onResult();
                            setOpen(false);
                        }}
                        className="px-3 py-2 flex items-center gap-2
                                   hover:bg-gray-100 cursor-pointer"
                    >
                        <FiBarChart2 />
                        結果
                    </li>

                    <li
                        onClick={() => {
                            onDelete();
                            setOpen(false);
                        }}
                        className="px-3 py-2 flex items-center gap-2
                                   text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                        <FiTrash2 />
                        削除
                    </li>
                </ul>
            )}
        </div>
    );
};

export default MenuButton;
