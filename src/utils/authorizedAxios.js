import axios from 'axios';
import { toast } from 'react-toastify'


// khởi tạo 1 đối tưởng Axios mục đích để custom và cấu hình chung cho dự án

let authorizedAxios = axios.create()

// thời gian chờ tối đa của 1 request
authorizedAxios.defaults.timeout = 1000*60*10
// withCredentials: true cho phép axios tự động đính kèm và  gửi cookie trong request tới BE
// phục vụ trường hợp nếu chúng ta sử dụng JWT Tokens ( refresh & access) theo cơ chế httpOnly Cookie

authorizedAxios.defaults.withCredentials = true

// can thiệp vào giữa những cái request API
authorizedAxios.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}` 
    }
        return config
    },(error) => {
        return Promise.reject(error)
    }
)
// can thiệp vào giữa những cái response nhận về từ API
authorizedAxios.interceptors.request.use((response) => {
        return response
    },(error) => {
        console.log('error: ', error)
        if (error?.response?.status !== 410) {
            // xử lý logout
            toast.error(error.response?.data?.message || error?.message)
        }

        return Promise.reject(error)
    }
)

export default authorizedAxiosInstance

