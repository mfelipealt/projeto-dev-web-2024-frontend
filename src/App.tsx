import { BaseRoutes } from '@/routes/BaseRoutes'
import { ChakraProvider } from '@chakra-ui/react'


function App() {
  return (
    <>
      <ChakraProvider>
        <BaseRoutes />
      </ChakraProvider>
    </>
  )
}

export default App