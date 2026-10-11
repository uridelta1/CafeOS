import { useCallback, useEffect, useState } from 'react';
import { productsApi } from '../api/productsApi.js';
export function useProducts() { const [products,setProducts]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(''); const refresh=useCallback(async()=>{setLoading(true);try{setProducts((await productsApi.list()).data);setError('')}catch(e){setError(e?.response?.data?.message||'Could not load products')}finally{setLoading(false)}},[]);useEffect(()=>{refresh()},[refresh]);return {products,loading,error,refresh}; }
