import React from "react"
import { IconBase } from "./IconBase"
import { IconProps } from "./types"

export const BanIcon: React.FC<IconProps> = (props) => {
  return (
    <IconBase {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 18M5.636 5.636L6 6"
      />
    </IconBase>
  )
}
