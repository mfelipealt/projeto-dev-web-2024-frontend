import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { UserSignInPage } from './assets/pages/UserSignInPage'
import { UserSignupPage } from './assets/pages/UserSignUpPage'

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<UserSignInPage />} />
        <Route path="/login" element={<UserSignInPage />} />
        <Route path="/cadastrar" element={<UserSignupPage />} />
      </Routes>
    </>
  )
}

export default App
