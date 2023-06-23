import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';

const style = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100vh',
};

function LoginPage(props) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onEmailHandler = e => setEmail(e.target.value);
  const onPasswordHandler = e => setPassword(e.target.value);

  const onSubmitHandler = e => {
    e.preventDefault();

    let body = {
      email: email,
      password: password,
    };

    dispatch(loginUser(body)).then(res => {
      if (res.payload.loginSuccess) {
        props.history.push('/');
      } else {
        alert('Error');
      }
    });
  };

  return (
    <div style={style}>
      <form
        style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHandler}
      >
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          type='email'
          value={email}
          onChange={onEmailHandler}
        />
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          type='password'
          value={password}
          onChange={onPasswordHandler}
        />
        <br />
        <button>Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
