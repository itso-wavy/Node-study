import React, { useEffect } from 'react';
import axios from 'axios';

const style = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100vh',
};

function LandingPage(props) {
  useEffect(() => {
    axios.get('/api/hello').then(res => {
      console.log(res);
    });
  }, []);

  const onClickHandler = () => {
    axios.get(`/api/users/logout`).then(response => {
      if (response.data.success) {
        props.history.push('/login');
      } else {
        alert('로그아웃 할 수 없습니다.');
      }
    });
  };
  return (
    <div style={style}>
      <h2>시작 페이지</h2>
      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  );
}

export default LandingPage;
