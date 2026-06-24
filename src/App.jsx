import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Overview from './pages/Overview.jsx'
import Experiments from './pages/Experiments.jsx'
import Strategy from './pages/Strategy.jsx'
import Conversations from './pages/Conversations.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/experiments" element={<Experiments />} />
        <Route path="/strategy" element={<Strategy />} />
        <Route path="/conversations" element={<Conversations />} />
      </Routes>
    </Layout>
  )
}
