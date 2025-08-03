import { useEffect } from 'react';
import './App.css';
import { useAuth, useHandler } from './redux/hooks/useAuth';
import AppRoutes from './routes/AppRouters';
import { useAppDispatch } from './redux/hooks/hooks';
import { getUser } from './redux/actions/getUser';
import { Loader } from 'lucide-react';

function App() {
  const user= useAuth();
  const {loading} = useHandler()
  const dispatch = useAppDispatch();


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

  if (loading) {
    return <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-3">
              <Loader className="h-8 w-8 text-amber-600 animate-spin" />
              <p
                className="text-amber-800 font-medium"
                style={{ fontFamily: '"Times New Roman", serif' }}
              >
                Loading your page...
              </p>
            </div>
          </div>; // Replace with your loading component
  }

  return <AppRoutes />;
}

export default App;