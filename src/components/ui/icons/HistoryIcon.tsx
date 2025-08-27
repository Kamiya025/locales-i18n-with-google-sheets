import React from "react"
import { IconBase } from "./IconBase"
import { IconProps } from "./types"

export const HistoryIcon: React.FC<IconProps> = (props) => {
  return (
    <IconBase {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </IconBase>
  )
}
