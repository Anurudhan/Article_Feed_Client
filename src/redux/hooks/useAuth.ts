
import { useSelector } from 'react-redux';
import type { RootState } from '../Store';


export const useAuth = () => {
  return useSelector((state: RootState) => state.auth.user);
};

export const useHandler = ()=>{
  return useSelector((state:RootState)=>state.auth)
}
