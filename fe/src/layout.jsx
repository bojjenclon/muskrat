import React from 'react'
import PropTypes from 'prop-types'

export const Layout = ({ children }) => {
  return (
    <div className='w-[640px] mx-auto mt-[36px] mb-[10px]'>
      {children}
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
}

export default Layout
