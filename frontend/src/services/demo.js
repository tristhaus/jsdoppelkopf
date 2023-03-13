import axios from 'axios'
const baseUrl = '/api/demo'

const obtain = async () => {
    const response = await axios.get(baseUrl)

    if (response.status === 200) {
        return response.data
    }
    else {
        console.error('demo service error', response)
        return null
    }
}

export default { obtain }
