import React from 'react'
import spinner from "/spinner.svg"
function Loading({h=6,w=6}) {
  return (
    <img src={spinner} className={`h-${h} w-${w} mx-auto inline-block mr-2 ml-2 animate-spin` } alt="...Loading" />
  )
}

export default Loading
