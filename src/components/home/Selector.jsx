import { React, useState, useEffect } from 'react'

const ProfileSettings = ({ name, currentSelect, options, handleChange }) => {
  const [active, setActive] = useState('inactive')

  useEffect(() => {
    if (options.length === 0) {
      setActive('no_options')
    }
  })

  const handleClick = (e) => {
    if (options.length > 0) {
      setActive((prev) => {
        if (prev === 'active') return 'inactive'
        return 'active'
      })
    }
  }

  const handleClickInput = (e) => {
    handleChange({ name, value: e.target.value })
  }

  return (
    <div className="select">
      <div className="select_title" onClick={handleClick}>{currentSelect}
        <div className={'select_title_arrow ' + active}></div>
      </div>
        <div className={'select_container ' + active}>
          {
            options.map((option, index) => {
              return (
                <div key={index} onClick={handleClickInput} className="option">
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
