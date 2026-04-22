import "./index.css";
import { createHashRouter, RouterProvider } from "react-router-dom";
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
import DemoPage from "./pages/DemoPage.jsx";

const router = createHashRouter([
    { path: "/", element: <App /> },
    {
        element: <EditLayout />,
        children: [
            { path: "edit/:formId", element: <Create /> },
            { path: "preview/:formId", element: <Preview /> },
            { path: "result/:formId", element: <Result /> },
        ],
    },
    { path: "create-new", element: <CreateNew /> },
    { path: "answer/:formId", element: <Answer /> },
    { path: "create-list", element: <CreateList /> },
    { path: "demo", element: <DemoPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
