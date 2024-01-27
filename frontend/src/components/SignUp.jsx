import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { balanceAtom, usernameAtom } from "../atom";
import { useSetRecoilState } from "recoil";

export default function SignUp() {
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const setUsernameAtom = useSetRecoilState(usernameAtom)
    const setBalanceAtom = useSetRecoilState(balanceAtom)

    async function sendData() {
        if (firstname.length == 0) {
            toast.warn("firstname required")
        }
        if (lastname.length == 0) {
            toast.warn("lastname required")
        }
        if (email.length == 0) {
            toast.warn("email required")
        }
        if (password.length == 0) {
            toast.warn("password required")
        }
        if (password.length <= 6) {
            toast.warn("password should be greater than 6 characters")
        }
        else {
            axios.post("http://localhost:8080/api/v1/user/signup", {
                firstname: firstname,
                lastname: lastname,
                username: email,
                password: password
            })
                .then(function (response) {
                    const token = `Bearer ${response.data.token}`
                    localStorage.setItem('token', token)
                    axios.get("http://localhost:8080/api/v1/account/balance", {
                        headers: {
                            "authorization": token
                        }
                    }).then((res) => {
                        setBalanceAtom(res.data.balance)
                    }).catch(e => {
                        toast.error("Error in getting balance")
                    })
                    setUsernameAtom(firstname)
                    toast.success("User registered successfully")
                    navigate('/home')
                })
                .catch(function (error) {
                    console.log(error.response.status);
                    if (error.response.status == 411) {
                        toast.error("Invalid Email..!");
                    }
                    else if (error.response.status == 410) {
                        toast.error("User already exists..!");
                    }
                    else {
                        toast.error("Error In server !");
                    }

                });
        }

    }

    return (
        <>
            <div className="bg-slate-200 grid place-content-center h-screen">
                <div className="grid place-content-center bg-white font-serif rounded-2xl shadow-xl">
                    <div className="text-center mt-4 mb-2 font-bold text-2xl">Sign Up</div>
                    <div className="text-center text-slate-500 font-semibold text-sm">Enter your information</div>
                    <div className="text-center text-slate-500 font-semibold text-sm">to create an account</div>
                    <div className="ml-4 mr-4">
                        <div className="ml-4 mt-5 mb-1 font-serif font-semibold text-sm">First Name</div>
                        <div className="ml-4"><input onChange={(e) => {
                            setFirstname(e.target.value)
                        }} value={firstname} className="w-64 mr-4 pl-2 text-sm placeholder:p-1 h-8 rounded-md" style={{ border: "1px solid #DCDCDC" }} placeholder="John"></input></div>
                        <div className="ml-4 mt-3 mb-1 font-serif font-semibold text-sm">Last Name</div>
                        <div className="ml-4"><input onChange={(e) => {
                            setLastname(e.target.value)
                        }} value={lastname} className="w-64 mr-4 pl-2 text-sm placeholder:p-1 h-8 rounded-md" style={{ border: "1px solid #DCDCDC" }} placeholder="Doe"></input></div>
                        <div className="ml-4 mt-3 mb-1 font-serif font-semibold text-sm">Email</div>
                        <div className="ml-4"><input onChange={(e) => {
                            setEmail(e.target.value)
                        }} value={email} className="w-64 mr-4 pl-2 text-sm placeholder:p-1 h-8 rounded-md" style={{ border: "1px solid #DCDCDC" }} placeholder="johndoe@example.com"></input></div>
                        <div className="ml-4 mt-3 mb-1 font-serif font-semibold text-sm">Password</div>
                        <div className="ml-4"><input onChange={(e) => {
                            setPassword(e.target.value)
                        }} value={password} className="w-64 mr-4 pl-2 text-sm placeholder:p-1 h-8 rounded-md" style={{ border: "1px solid #DCDCDC" }} placeholder="Password"></input></div>
                        <div className="mt-5 mb-2 grid place-content-center"><button onClick={sendData} className="bg-slate-900 rounded-md text-white w-64 h-12 hover:bg-slate-800">Sign Up</button>
                            <ToastContainer
                                position="top-right"
                                autoClose={3000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                            />
                        </div>
                        <div className="flex place-content-center mb-4 font-semibold text-sm">Alraedy have an account?<Link to="/signin" className="underline">Login</Link></div>
                    </div>
                </div>
            </div>
        </>
    )
} 