import dynamic from 'next/dynamic'

function Dashboard() {
  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', padding:'20px'}}>
      <h1>DASHBOARD CHAL GAYA ✅</h1>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Dashboard), {
  ssr: false
})
