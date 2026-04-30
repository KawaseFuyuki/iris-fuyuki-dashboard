import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect } from "react"

export default function Dashboard() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "unauthenticated") signIn('discord')
  }, [status])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-pink-400 text-xl">Loading Iris Dashboard...</p>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-pink-500/20 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-400">Iris Dashboard ❤️</h1>
          <button onClick={() => signOut()} className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-sm">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-8">
          <img src={session.user.image} alt="PFP" className="w-16 h-16 rounded-full border-2 border-pink-500" />
          <div>
            <h2 className="text-3xl font-bold">Welcome, {session.user.name}</h2>
            <p className="text-gray-400">Fuyuki bot dashboard</p>
          </div>
        </div>
      </div>
    </div>
  )
    }
