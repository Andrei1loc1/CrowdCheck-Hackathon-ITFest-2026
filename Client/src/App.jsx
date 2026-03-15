import React from 'react'
import Dashboard from "./pages/Dashboard.jsx";
import MapPage from "./pages/MapPage.jsx";
import AI_Docs from "./pages/AI_Docs.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import BottomBar from "./components/layout/BottomBar.jsx";
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const location = useLocation();
    const showBottomBar = location.pathname !== '/onboarding';
    
    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Outlet />
            {showBottomBar && <BottomBar />}
        </div>
    )
}

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="map" element={<MapPage />} />
                    <Route path="docs" element={<AI_Docs />} />
                </Route>
                <Route path="/onboarding" element={<Onboarding />} />
            </Routes>
        </BrowserRouter>
    )
}
export default App
