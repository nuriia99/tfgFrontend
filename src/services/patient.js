import axios from 'axios'

export const getPatient = async ({ id, token }) => {
  try {
    const res = await axios.get('/patients/' + id, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    return res
  } catch (error) {
    return error
  }
}

export const getPdf = async ({ url, token }) => {
  try {
    const res = await axios.get('/patients/pdf/' + url, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    return res
  } catch (error) {
    return error
  }
}

export const getSearchPatient = async ({ name, surname1, surname2, sex, dni, cip, token }) => {
  try {
    let url = `/patients/?${name ? 'nombre=' + name : ''}${name ? '&&' : ''}${surname1 ? 'apellido1=' + surname1 : ''}${surname1 ? '&&' : ''}${surname2 ? 'apellido2=' + surname2 : ''}${surname2 ? '&&' : ''}${sex ? 'sexo=' + sex : ''}${sex ? '&&' : ''}${dni ? 'dni=' + dni : ''}${dni ? '&&' : ''}${cip ? 'cip=' + cip : ''}${cip ? '&&' : ''}`
    url = url.substring(0, url.length - 2)
    const res = await axios.get(url, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    return res
  } catch (error) {
    return error
  }
}
