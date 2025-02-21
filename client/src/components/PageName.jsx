import React from 'react'
import styles from './css_modules/PageName.module.css'

const PageName = () => {
  return (
    <>
      <h1 className = {styles.pageName}>Flavour<span style = {{color: "#4470E2"}}>Finder</span></h1>
    </>
  )
}

export default PageName
