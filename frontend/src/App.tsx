import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/code-highlight/styles.css'
import '@mantine/spotlight/styles.css'

import { MantineProvider, createTheme, rem } from '@mantine/core'
import Home from './Home'
import React from 'react'
import { TrpcProvider } from './TrpcProvider'
import { ErrorBoundary } from 'react-error-boundary'

const theme = createTheme({
  colors: {
    violet: [
      '#f6ecff',
      '#e7d6fb',
      '#caabf1',
      '#ac7ce8',
      '#9354e0',
      '#833cdb',
      '#7b2eda',
      '#6921c2',
      '#5d1cae',
      '#501599',
    ],
    ye: [
      '#fff8e0',
      '#ffeeca',
      '#ffdb99',
      '#ffc762',
      '#ffb536',
      '#ffab18',
      '#ffa503',
      '#e49000',
      '#cb7f00',
      '#b06d00',
    ],
  },
  primaryColor: 'violet',

  fontFamily: 'JetBrains Mono',
  fontFamilyMonospace: 'JetBrains Mono',

  focusRing: 'auto',

  headings: {
    fontFamily: 'JetBrains Mono, monospace',
    sizes: {
      h1: { fontSize: rem(36) },
    },
  },
})

function Fallback({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <TrpcProvider>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Home />
        </MantineProvider>
      </TrpcProvider>
    </ErrorBoundary>
  )
}

export default App
