import { mockCurrentUser } from '@/data/mockData';
import UserDashboard from './user/UserDashboard';
import WorkerDashboardPage from './worker/WorkerDashboardPage';

const Dashboard = () => {
  // In real app, this would come from auth context
  const userRole = mockCurrentUser.role;

  if (userRole === 'worker') {
    return <WorkerDashboardPage />;
  }

  return <UserDashboard />;
};

export default Dashboard;
