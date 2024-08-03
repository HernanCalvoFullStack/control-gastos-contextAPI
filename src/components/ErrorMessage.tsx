import { ReactNode } from "react"

type ErrorMessagePropos = {
    children: ReactNode
}

const ErrorMessage = ({children} : ErrorMessagePropos) => {
  return (
    <p className="bg-red-600 p-2 text-white font-bold text-sm text-center">
        {children}
    </p>
  )
}

export default ErrorMessage