import { authApi } from '../api/authApi.js';
export function useAuth(){return {login:async credentials=>(await authApi.login(credentials)).data,register:async payload=>(await authApi.register(payload)).data};}
