import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LanidingPage from './pages/LandingPage/LandingPage';
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';  
import {Toaster} from 'react-hot-toast';
import ApplicationViewer from './pages/Employer/ApplicationViewer';
import EmployerProfilePage from './pages/Employer/EmployerProfilePage';
import JobSeekerDashboard from './pages/JobSeeker/JobSeekerDashboard';
import SavedJobs from './pages/JobSeeker/SavedJobs';
import UserProfile from './pages/JobSeeker/UserProfile';
import MyApplications from './pages/JobSeeker/MyApplications';
import JobDetails from './pages/JobSeeker/JobDetails';
import ProtectedRoute from './routes/ProtectedRoute';
import EmployerDashboard from './pages/Employer/EmployerDashboard';
import JobPostingForm from './pages/Employer/JobPostingForm';
import ManageJobs from './pages/Employer/ManageJobs';
import { AuthProvider } from './context/AuthContext';
import SignupSuccess from "./pages/AuthSuccess";
import { useAuth } from './context/useAuth';

function PublicOnlyRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'employer' ? '/employer-dashboard' : '/find-jobs'} replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <div>
        <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicOnlyRoute><LanidingPage/></PublicOnlyRoute>} />
            <Route path="/signup" element={<PublicOnlyRoute><SignUp/></PublicOnlyRoute>} />
            <Route path="/login" element={<PublicOnlyRoute><Login/></PublicOnlyRoute>} />
            <Route path="/find-jobs" element={<JobSeekerDashboard/>} />
            <Route path="/job/:jobId" element={<JobDetails/>} />
            <Route  path="/auth-success" element={<SignupSuccess />}/>
            <Route element={<ProtectedRoute requiredRole="jobseeker" />}>
              <Route path="/saved-jobs" element={<SavedJobs/>} />
              <Route path="/profile" element={<UserProfile/>} />
              <Route path="/my-applications" element={<MyApplications/>} />
            </Route>
            {/* Private Routes */}
            <Route element={<ProtectedRoute requiredRole="employer" />}>
            <Route path="/employer-dashboard" element={<EmployerDashboard/>} />
            <Route path="/post-job" element={<JobPostingForm/>} />
            <Route path="/manage-jobs" element={<ManageJobs/>} />
            <Route path="/applicants" element={<ApplicationViewer/>} />
            <Route path="/company-profile" element={<EmployerProfilePage/>} />
            </Route>

            {/* catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        </AuthProvider>
        <Toaster toastOptions={{className:"",style:{ frontSize: '13px' },}}/>
      </div>
    </>
  )
}

export default App
