// const EnhancedComponent = higherOrderComponent(WrappedComponent)
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import { auth } from '../_actions/user_action';

export default function Auth(SpecificComponent, option, adminRoute = null) {
  /* 
  null => 모두 출입 가능한 페이지
  true => 로그인한 유저 출입 가능한 페이지
  false => 로그인한 유저 출입 불가능한 페이지 
  */

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then(res => {
        console.log(res);
        if (!res.payload.isAuth && option) {
          // 로그인 하지 않은 상태
          props.history.push('/login');
        } else if (adminRoute && !res.payload.isAdmin) {
          // 로그인 상태
          props.history.push('/');
        } else if (option === false) props.history.push('/');
      });
      Axios.get('/api/user/auth');
    }, []);

    return <SpecificComponent />;
  }
}
