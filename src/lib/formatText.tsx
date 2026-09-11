import type { ReactNode } from 'react'

export function renderFormattedText(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    const boldStart = remaining.indexOf('**')
    if (boldStart === -1) {
      parts.push(remaining)
      break
    }
    if (boldStart > 0) parts.push(remaining.slice(0, boldStart))
    const boldEnd = remaining.indexOf('**', boldStart + 2)
    if (boldEnd === -1) {
      parts.push(remaining.slice(boldStart))
      break
    }
    parts.push(<strong key={key++}>{remaining.slice(boldStart + 2, boldEnd)}</strong>)
    remaining = remaining.slice(boldEnd + 2)
  }

  return parts
}
