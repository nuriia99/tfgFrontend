import { React, useState, useContext, createContext } from 'react'

const useSelectContext = () => {
  const context = useContext(SelectContext)

  if (!context) {
    throw new Error('Child components of Selector cannot be rendered outside the Card component!')
  }

  return context
}

const SelectContext = createContext()

export const Option = ({ option }) => {
  const { changeSelectedOption } = useSelectContext()
  return (
    <div className='option'>
      <button onClick={() => { changeSelectedOption(option) }} id={option} value ={option}>{option}</button>
    </div>
  )
}

export const Select = ({ currentSelect, handleChange, children }) => {
  const [currentOption, setCurrentOption] = useState(currentSelect)
  const [showDropdown, setShowDropdown] = useState('inactive')

  const showDropdownHandler = () => setShowDropdown((prev) => {
    if (prev === 'active') return 'inactive'
    return 'active'
  })

  const updateCurrentOption = (option) => {
    setCurrentOption(option)
    setShowDropdown((prev) => {
      if (prev === 'active') return 'inactive'
      return 'active'
    })
    handleChange(option)
  }

  return (
    <SelectContext.Provider value={{ currentSelect, changeSelectedOption: updateCurrentOption }}>
      <div className='select'>
      <div className='select_title' onClick={showDropdownHandler}>{currentOption}
        <div className={'select_title_arrow ' + showDropdown}></div>
      </div>
      <div className={'select_container ' + showDropdown}>
        {children}
      </div>
    </div>
    </SelectContext.Provider>
  )
}
