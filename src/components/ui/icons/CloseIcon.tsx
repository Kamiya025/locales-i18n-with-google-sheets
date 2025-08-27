import React from "react"
import { IconBase } from "./IconBase"
import { IconProps } from "./types"

export const CloseIcon: React.FC<IconProps> = (props) => {
  return (
    <IconBase {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </IconBase>
  )
}
