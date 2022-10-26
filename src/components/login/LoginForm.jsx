import {React} from 'react'
import { useState } from 'react'
import { useLogin } from '../../hooks/useAuth'




const LoginForm = () => {
  const [username, setUsername] = useState('1Q2W3E4R')
  const [password, setPassword] = useState('1Q2W3E4R')
  const {login, error, isLoading} = useLogin()

  const handleClick = async (e) => {
    e.preventDefault();

    if(!username || !password) {
      return alert('Rellene todos los campos.')
    }
    await login(username, password)
  
  }

  return (
    <form onSubmit={handleClick}>
      <div className="login">
        <div className="login_container">
          <div className="login_container_title">
            <h3>Iniciar sesión</h3>
          </div>
          <div className="login_container_input">
            <input type="text" value={username} name="inputUsername" onChange={({target}) => setUsername(target.value)} required="required"/>
            <span>Usuario</span>
          </div>
          <div className="login_container_input">
            <input type="password" value={password} name="inputPassword" onChange={({target}) => setPassword(target.value)} required="required" autoComplete="on"/>
            <span>Contraseña</span>
          </div>
          <div className="login_container_button">
            <button disabled={isLoading}>Iniciar sesión</button>
          </div>
          {error && <div className="error">
            <p className='error_message'>{error}</p>
          </div>}
        </div>
      </div>
    </form>
    
      
  )
}

export default LoginForm