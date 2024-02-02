import { useState, useEffect } from "react";

const useSessionStorage = (name: string, data?: any) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(sessionStorage.getItem(name))
  }, [name, data])

  return value
}

export default useSessionStorage
