import React from 'react'
import style from './Loading.module.css'

function Loanding() {
  return (
    <div class={style.loadingContainer}>
      <div class={style.spinner}></div>
      <div class={style.loadingText}>Cargando...</div>
    </div>
  )
}

export default Loanding