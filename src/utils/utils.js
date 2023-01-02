import _ from 'lodash'

export const getDate = (date) => {
  const d = new Date(date)
  let day = d.getDate()
  if (day < 10) day = '0' + day
  let month = d.getMonth() + 1
  if (month < 10) month = '0' + month
  return day + '/' + month + '/' + d.getFullYear()
}

export const getHour = (date) => {
  const d = new Date(date)
  let hour = d.getHours() - 1
  if (hour === -1) hour = '23'
  else if (hour === 0) hour = '00'
  else if (hour < 10) hour = '0' + hour
  let minute = d.getMinutes()
  if (minute === 0) minute = '00'
  else if (minute < 10) minute = '0' + minute
  return hour + ':' + minute
}

export const getCurrentDate = () => {
  const d = new Date()
  let day = d.getDate()
  if (day < 10) day = '0' + day
  let month = d.getMonth() + 1
  if (month < 10) month = '0' + month
  return day + '/' + month + '/' + d.getFullYear()
}

export const getFormalName = (nombre, apellido1, apellido2) => {
  return _.toUpper(apellido1) + ' ' + _.toUpper(apellido2) + ', ' + _.toUpper(nombre)
}

export const getName = (nombre, apellido1, apellido2) => {
  return _.toUpper(nombre) + ' ' + _.toUpper(apellido1) + ' ' + _.toUpper(apellido2)
}
