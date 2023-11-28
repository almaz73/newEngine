import axios from "axios";

axios.interceptors.response.use(resp => resp
    , err => {
        console.log('err ', err);
        console.log(" err.request.status = ", err.request.status)
    })

