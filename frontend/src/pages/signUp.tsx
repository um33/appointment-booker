import { useState } from "react";
import loginInfo from "../api/auth"
import { useNavigate } from "react-router-dom";

export function ClientLogin (){
    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)


    async function handelSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const res =await loginInfo.signUpClient.signUp(name, email, password,role);
            console.log(res.user)
            if(res.user.role === "PROVIDER"){
                navigate("/dashboard/admin")
            } else {
                navigate("/dashboard/client")
            }
                    
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally{
            setLoading(false)
        }
    }


    
    return(
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
  <div className="w-full max-w-md">
    {/* Header */}
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
        <span className="text-lg font-bold">B</span>
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Get started in less than a minute.
      </p>
    </div>

    {/* Card */}
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-200/60 backdrop-blur">
      <form onSubmit={handelSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Admin, User"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </form>
    </div>

    <p className="mt-4 text-center text-xs text-slate-500">
      By continuing you agree to our terms.
    </p>
  </div>
</div>

    )
}
export default ClientLogin