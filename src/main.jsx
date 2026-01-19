import "./index.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import Create from "./pages/Create.jsx";
import CreateNew from "./pages/CreateNew.jsx";
import CreateList from "./pages/CreateList.jsx";
import Answer from "./pages/Answer.jsx";
import Preview from "./pages/Preview.jsx";
import Result from "./pages/Result.jsx";
import EditLayout from "./layouts/EditLayout.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <HashRouter>
            <Routes>
                {/* トップ */}
                <Route path="/" element={<App />} />

                {/* 共通レイアウト */}
                <Route element={<EditLayout />}>
                    <Route path="edit/:formId" element={<Create />} />
                    <Route path="preview/:formId" element={<Preview />} />
                    <Route path="result/:formId" element={<Result />} />
                </Route>

                {/* 単独ページ */}
                <Route path="create-new" element={<CreateNew />} />
                <Route path="answer/:formId" element={<Answer />} />
                <Route path="create-list" element={<CreateList />} />
            </Routes>
        </HashRouter>
    </StrictMode>
);
