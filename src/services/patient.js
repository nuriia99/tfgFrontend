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
