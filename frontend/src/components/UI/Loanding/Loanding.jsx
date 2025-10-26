import React from 'react'
import style from './Loading.module.css'

function Loanding() {
  return (
    <div class={style.loading-container}>
      <div class={style.spinner}></div>
      <div class={style.loading-text}>Cargando...</div>
    </div>
  )
}

export default Loanding