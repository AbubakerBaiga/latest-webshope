import {Fragment, useEffect} from 'react'
import Home from './pages/Home'
import {apiService} from './services/apiService'
export default function App() {
  useEffect(()=>{
    console.log('called')
    apiService.fetchCsrf()
  },[])
  return (
    <Fragment>
      <Home/>
    </Fragment>
  )
}