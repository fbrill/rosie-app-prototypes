import { Stepper } from "./Stepper"

export const PageShell = ({ children }) => {
  return (
    <div className="bg-gray-200 p-2.5 min-h-screen">
      <div className="bg-gradient-to-b from-white to-gray-25 rounded-[10px] p-4 sm:p-7 min-h-[calc(100vh-20px)]">
        <div className="max-w-[720px] mx-auto">
          <div className="flex justify-center items-center">
            <img src="/images/logo.svg" alt="Rosie" />
          </div>
          <Stepper />
          {children}
        </div>
      </div>
    </div>
  )
}
