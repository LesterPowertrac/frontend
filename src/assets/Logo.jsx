import React, { Suspense, lazy } from 'react'

const Logo = () => {
  return (
    <div>
        
        <img src="/frontend/powertrac_logo.png" loading="lazy" alt="logo" style={{width: '10rem', marginLeft: '2rem'}}/>
    </div>
  )
}

export default Logo