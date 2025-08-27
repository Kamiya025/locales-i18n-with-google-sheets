import React from "react"
import { IconBase } from "./IconBase"
import { IconProps } from "./types"

export const CheckIcon: React.FC<IconProps> = (props) => {
  return (
    <IconBase {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </IconBase>
  )
}
