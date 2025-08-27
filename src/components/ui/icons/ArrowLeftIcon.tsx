import React from "react"
import { IconBase } from "./IconBase"
import { IconProps } from "./types"

export const ArrowLeftIcon: React.FC<IconProps> = (props) => {
  return (
    <IconBase {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </IconBase>
  )
}
