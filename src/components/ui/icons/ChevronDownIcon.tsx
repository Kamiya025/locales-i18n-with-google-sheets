import React from "react"
import { IconBase } from "./IconBase"
import { IconProps } from "./types"

export const ChevronDownIcon: React.FC<IconProps> = (props) => {
  return (
    <IconBase {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4 4 4-4" />
    </IconBase>
  )
}
