import { useState } from "react";
import loginInfo from "../api/auth"
import { useNavigate } from "react-router-dom";

export function ClientLogin (){
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)


    async function handelSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const res =await loginInfo.login(email, password);
            console.log(res.user)
            navigate(res.user.role === "PROVIDER"? "/dashboard/admin":"/dashboard/client")
                    
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally{
            setLoading(false)
        }
    }


    
    return(
        <div>
         <form onSubmit={handelSubmit}>
         <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
         <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/>
         <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
            </button>
         </form>
         {error && <p style={{ color: "crimson" }}>{error}</p>}
        </div>
    )
}
export default ClientLogin