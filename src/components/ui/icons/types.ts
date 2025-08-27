export interface IconProps {
  className?: string
  size?: number | string
  color?: string
  fill?: string
  stroke?: string
  strokeWidth?: number
}

export interface IconBaseProps extends IconProps {
  children: React.ReactNode
  viewBox?: string
}
