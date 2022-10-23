import React from 'react'

const LoginForm = () => {
  const handleClick = (e) => {
    console.log(e)
  }


  return (
      <div className="login">
        <div className="login_container">
          <div className="login_container_title">
           <h3>Iniciar sesión</h3>
          </div>
          
          <div className="login_container_input">
            <input type="text" name="" id="" required="required"/>
            <span>Usuario</span>
          </div>
          <div className="login_container_input">
            <input type="password" name="" id="" required="required"/>
            <span>Contraseña</span>
          </div>
          <div className="login_container_button">
           <button onClick={handleClick}>Iniciar sesión</button>
          </div>
          
        </div>
      </div>
  )
}

export default LoginForm