import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import WelcomeCard from "../components/dashboard/WelcomeCard.jsx";
import QueueStatusCard from "../components/dashboard/QueueStatusCard.jsx";
import WeeklyStatus from "@/components/dashboard/WeeklyStatus.jsx";
import HourlyStatus from "@/components/dashboard/HourlyStatus.jsx";
import SearchBar from "@/components/layout/SearchBar.jsx";
import { useDashboardData } from "@/hooks/useDashboardData.js";

const Dashboard = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [searchQuery, setSearchQuery] = useState('')
    
    // Get institution from URL params (passed from MapPage or AI_Docs)
    const selectedInstitutionName = searchParams.get('institution');
    
    // Use the dashboard data hook
    const { 
        institutionData, 
        hourlyData, 
        weeklyData, 
        loading, 
        error, 
        refresh 
    } = useDashboardData();
    
    // If there's an institution from URL, show it, otherwise use the one from server
    const displayInstitution = selectedInstitutionName || institutionData?.name;
    const displayDesk = institutionData?.desk || "Ghișeul 1";
    const displayWaitTime = institutionData?.waitTime || 12;
    const displayStatus = institutionData?.status || "LIBER";
    
    return (
        <section className="flex-1 overflow-y-auto pb-20">
            
            
            <WelcomeCard name={"Andrei"}/>
            
            <QueueStatusCard
                institution={displayInstitution}
                desk={displayDesk}
                waitTime={displayWaitTime}
                status={displayStatus}
                loading={loading}
                error={error}
                onRefresh={refresh}
            />

            <HourlyStatus data={hourlyData} loading={loading} />

            <WeeklyStatus data={weeklyData} loading={loading} />
        </section>
    )
}
export default Dashboard
