import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Sidebar from "./components/ui/Sidebar";
import FinancialPerformanceDashboard from './pages/financial-performance-dashboard';
import OperationsCommandCenter from './pages/operations-command-center';
import BusinessIntelligenceAnalytics from './pages/business-intelligence-analytics';
import ExecutiveOverviewDashboard from './pages/executive-overview-dashboard';
import UsersManagement from './pages/users-management';
import WorkersManagement from './pages/workers-management';
import Transactions from './pages/transactions';
import Messages from './pages/messages';
import Categories from './pages/categories';
import UserDetail from './pages/user-detail';
import WorkerDetail from './pages/worker-detail';
import Banners from './pages/banners';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                  <BusinessIntelligenceAnalytics />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/financial-performance-dashboard" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                  <FinancialPerformanceDashboard />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/operations-command-center" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                  <OperationsCommandCenter />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/business-intelligence-analytics" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                  <BusinessIntelligenceAnalytics />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/executive-overview-dashboard" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                  <ExecutiveOverviewDashboard />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/users-management" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                  <UsersManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/users-management/:userId" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                  <UserDetail />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/workers-management" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                  <WorkersManagement />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/workers-management/:workerId" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                  <WorkerDetail />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/transactions" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                  <Transactions />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/messages" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                  <Messages />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/categories" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                  <Categories />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/banners" element={
            <ProtectedRoute>
              <div className="flex">
                <Sidebar />
                <div className="flex-1 lg:ml-64">
                  <Banners />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
