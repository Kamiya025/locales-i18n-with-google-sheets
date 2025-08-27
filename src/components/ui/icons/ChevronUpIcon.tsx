import React from "react"
import { IconBase } from "./IconBase"
import { IconProps } from "./types"

export const ChevronUpIcon: React.FC<IconProps> = (props) => {
  return (
    <IconBase {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 15l4-4 4 4" />
    </IconBase>
  )
}
