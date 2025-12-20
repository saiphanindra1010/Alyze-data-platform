import axios from 'axios'
const beurl= import.meta.env.VITE_BEAPI;
const api=axios.create({
    baseURL:beurl+'/auth'
})
export const googleAuth=(code)=>api.get(`/googleauth?code=${code}`)