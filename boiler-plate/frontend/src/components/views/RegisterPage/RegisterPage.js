import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';

const style = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100vh',
};

function RegisterPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState('');
  const [Name, setName] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');

  const onEmailHandler = e => setEmail(e.target.value);
  const onNameHandler = e => setName(e.target.value);
  const onPasswordHandler = e => setPassword(e.target.value);
  const onConfirmPasswordHandler = e => setConfirmPassword(e.target.value);

  const onSubmitHandler = e => {
    e.preventDefault();

    if (Password !== ConfirmPassword) {
      return alert('비밀번호가 일치하지 않습니다.');
    }

    let body = {
      email: Email,
      password: Password,
      name: Name,
    };
    dispatch(registerUser(body)).then(response => {
      if (response.payload.success) {
        props.history.push('/login');
      } else {
        alert('Failed to sign up');
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
          value={Email}
          onChange={onEmailHandler}
        />
        <label htmlFor='name'>Name</label>
        <input id='name' type='text' value={Name} onChange={onNameHandler} />
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          type='password'
          value={Password}
          onChange={onPasswordHandler}
        />
        <label htmlFor='confirm-pw'>Confirm Password</label>
        <input
          id='confirm-pw'
          type='password'
          value={ConfirmPassword}
          onChange={onConfirmPasswordHandler}
        />
        <br />
        <button type='submit'>회원 가입</button>
      </form>
    </div>
  );
}

export default RegisterPage;
