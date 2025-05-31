import { useEffect } from 'react';
import './App.css';
import { useAuth, useHandler } from './redux/hooks/useAuth';
import AppRoutes from './routes/AppRouters';
import { useAppDispatch } from './redux/hooks/hooks';
import { getUser } from './redux/actions/getUser';
import  { useToast } from './contexts/ToastContext';


function App() {
  const user= useAuth();
  const {loading,error} = useHandler()
  const dispatch = useAppDispatch();
  const {showToast} = useToast()

  useEffect(() => {
    // Run getUser on mount to restore user state
    if(!user){
    dispatch(getUser())
      .unwrap()
      .then((result) => {
        console.log('getUser success:', result);
      })
      .catch((err) => {
        console.error('getUser error:', err);
      });
    }
  }, [dispatch,user]); // Only run on mount

  useEffect(() => {
    if (error) {
      showToast(error, 'error'); // Show error feedback
    }
  }, [error,showToast]);

  if (loading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  return <AppRoutes />;
}

export default App;