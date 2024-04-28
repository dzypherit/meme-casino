import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useTransactionError } from 'gamba-react-v2'
import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Modal } from './components/Modal'
import { StyledSection } from './components/Slider'
import { useToast } from './hooks/useToast'
import Dashboard from './sections/Dashboard/Dashboard'
import Game from './sections/Game/Game'
import Header from './sections/Header'
import RecentPlays from './sections/RecentPlays/RecentPlays'
import Toasts from './sections/Toasts'
import { useUserStore } from './hooks/useUserStore'
import { GambaUi } from 'gamba-react-ui-v2'

function ScrollToTop() {
  const { pathname } = useLocation()
  React.useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

function ErrorHandler() {
  const walletModal = useWalletModal()
  const toast = useToast()
  const [error, setError] = React.useState<Error>()

  useTransactionError(
    (error) => {
      if (error.message === 'NOT_CONNECTED') {
        walletModal.setVisible(true)
        return
      }
      toast({ title: '❌ Transaction error', description: error?.error?.errorMessage ?? error.message })
    },
  )

  return (
    <>
      {error && (
        <Modal onClose={() => setError(undefined)}>
          <h1>Error occured</h1>
          <p>{error.message}</p>
        </Modal>
      )}
    </>
  )
}

export default function App() {
  const newcomer = useUserStore((state) => state.newcomer)
  const set = useUserStore((state) => state.set)
  return (
    <>
      {newcomer && (
        <Modal>
          <h1>Welcome</h1>
          <div style={{ position: 'relative' }}>
            <div style={{ maxHeight: '400px', padding: '10px', overflow: 'auto', position: 'relative' }}>
            <p>
    Phantom issues a cautionary notice regarding the sensitive nature of gambling. Should you choose to proceed, it's at your discretion to engage in gambling activities, disregarding this warning.
    <br/>
    If you harbor any doubts about linking to and gambling on an unfamiliar website like ours, consider creating a separate wallet dedicated solely to gambling purposes.
</p>
<br/>
<p>
    Our platform operates with full decentralization. Upon connecting, you gain access to execute and authorize transactions. This is because each bet placed corresponds to a program on the Solana Blockchain, necessitating a transaction signature for every bet within the platform's games. Additionally, we utilize the GAMBA SDK Infrastructure, a decentralized betting platform on Solana.
</p>
<br/>
<p>
    <b>1. Age Requirement:</b> You must be at least 18 years old.
    <br/>
    <b>2. Risk Acknowledgement:</b> Games involve risk, with no guaranteed winnings.
    <br/>
    <b>3. Fair Play:</b> Games are conducted fairly and transparently.
    <br/>
    <b>4. Data Privacy:</b> We prioritize your privacy.
    <br/>
    <b>5. Responsible Gaming:</b> Play responsibly and seek help if needed.
</p>
            </div>
            <div style={{ background: 'linear-gradient(180deg, transparent, #15151f)', height: '50px', pointerEvents: 'none', width: '100%', position: 'absolute', bottom: '0px', left: '0px' }}></div>
          </div>
          <p>
            By playing on our platform, you confirm your compliance.
          </p>
          <GambaUi.Button main onClick={() => set({ newcomer: false })}>
            Acknowledge
          </GambaUi.Button>
        </Modal>
      )}
      <ScrollToTop />
      <ErrorHandler />
      <Header />
      <Toasts />
      <StyledSection>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/:gameId" element={<Game />} />
        </Routes>
        <h2 style={{ textAlign: 'center' }}>Recent Plays</h2>
        <RecentPlays />
      </StyledSection>
    </>
  )
}
