import React from "react"
import { IconBase } from "./IconBase"
import { IconProps } from "./types"

export const LogoutIcon: React.FC<IconProps> = (props) => {
  return (
    <IconBase {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </IconBase>
  )
}
