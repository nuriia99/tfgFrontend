import { React, useState } from 'react'

const ProfileSettings = ({ name, currentSelect, options, handleChange }) => {
  const [active, setActive] = useState(false)

  const handleClick = (e) => {
    setActive(!active)
  }

  const handleClickInput = (e) => {
    handleChange({ name, value: e.target.value })
  }

  return (
    <div className="select">
      <div className="select_title" onClick={handleClick}>{currentSelect}</div>
        <div className={active ? 'select_container active' : 'select_container'}>
          {
            options.map((option, index) => {
              return (
                <div key={index} value='a' onClick={handleClickInput} className="option">
                  <button value ={option}>{option}</button>
                </div>
              )
            })
          }
        </div>
    </div>
  )
}

export default ProfileSettings
