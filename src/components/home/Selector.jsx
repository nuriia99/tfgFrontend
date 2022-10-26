import {React, useState} from 'react'


const ProfileSettings = ({currentSelect, options}) => {

  const [active, setActive] = useState(false)
  const handleClick = () => {
    setActive(!active)
    console.log(active)
  }


  return (
    <div className="select">
      <div className="select_title" onClick={handleClick}>{currentSelect}</div>
        <div className={active ? "select_container active" : "select_container"}>
          {
            options.map((option, index) => {
              
              return (
                <div key={index} className="option">
                  <input type="radio" className='radio' id={option}/>
                  <label>{option}</label>
                </div>
              )
            })
          }
        </div>
    </div>
  )
}

export default ProfileSettings