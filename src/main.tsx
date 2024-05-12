import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import { UserSignupPage } from './assets/pages/UserSignUpPage/index.tsx'
import { UserSignInPage } from './assets/pages/UserSignInPage/index.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserSignupPage />
    <UserSignInPage />
  </React.StrictMode>,
)
