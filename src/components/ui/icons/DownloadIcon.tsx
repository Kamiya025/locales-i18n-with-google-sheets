import React from "react"
import { IconBase } from "./IconBase"
import { IconProps } from "./types"

export const DownloadIcon: React.FC<IconProps> = (props) => {
  return (
    <IconBase {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15l-4-4m4 4l4-4m-4 4V3m0 12H5a2 2 0 01-2-2v-2a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2H12z"
      />
    </IconBase>
  )
}
