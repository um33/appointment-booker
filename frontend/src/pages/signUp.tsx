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
            navigate("/")
                    
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally{
            setLoading(false)
        }
    }


    
    return(
        <div>
         <form onSubmit={handelSubmit}>
        <input type="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name"/>
         <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
         <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password"/>
        <input type="role" value={role} onChange={(e)=>setRole(e.target.value)} placeholder="Role"/>
         <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "SignIn"}
            </button>
         </form>
         {error && <p style={{ color: "crimson" }}>{error}</p>}
        </div>
    )
}
export default ClientLogin