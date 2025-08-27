import React from "react"
import { IconBaseProps } from "./types"

export const IconBase: React.FC<IconBaseProps> = ({
  children,
  className = "",
  size = 24,
  color = "currentColor",
  viewBox = "0 0 24 24",
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
  ...props
}) => {
  const sizeValue = typeof size === "number" ? `${size}px` : size

  return (
    <svg
      className={className}
      width={sizeValue}
      height={sizeValue}
      viewBox={viewBox}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      {...props}
    >
      {children}
    </svg>
  )
}
