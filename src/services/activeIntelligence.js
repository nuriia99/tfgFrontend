import axios from 'axios'

export const getAi = async ({ id, token }) => {
  try {
    const res = await axios.get('/patients/' + id + '/activeIntelligence', {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    return res.data
  } catch (error) {
    return error
  }
}
