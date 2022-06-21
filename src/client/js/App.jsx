import React, { useState, useRef } from 'react'
import { useEffect } from 'react';


import Display from './Display';
import Form from './Form';


function App() {

  if (window.location.pathname === '/post') {
    return <Form />
  }

  return (
    <Display />
  )
}

export default App
