// ...existing code...
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Create from "./pages/Create.jsx"; // または ./pages/create.jsx（実ファイル名に合わせる）
import CreateList from "./pages/CreateList.jsx";
import Answer from "./pages/Answer.jsx";
import Preview from "./pages/Preview.jsx";
import Result from "./pages/Result.jsx";
import EditLayout from "./layouts/EditLayout.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/" element={<EditLayout />}>
                    <Route path="/edit/:formId" element={<Create />} />
                    <Route path="/preview/:formId" element={<Preview />} />
                    <Route path="/result/:formId" element={<Result />} />
                </Route>
                <Route path="/answer/:formId" element={<Answer />} />
                <Route path="/create-list" element={<CreateList />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
