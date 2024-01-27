import { useRecoilValue } from "recoil"
import { usernameAtom } from "../atom"
import { balanceAtom } from "../atom"
import { useEffect, useState } from "react"
import axios from "axios"
import Modal from "./Modal"



export default function Home() {
    const usernameAtomValue = useRecoilValue(usernameAtom)
    const balanceAtomValue = useRecoilValue(balanceAtom)
    const [filter, setFilter] = useState("")
    const [users, setUsers] = useState("")

    useEffect(() => {
        axios.get(`http://localhost:8080/api/v1/user/bulk/?filter=${filter}`)
            .then((res) => {
                setUsers(res.data.user.filter(element=>element.firstname!=usernameAtomValue))
            }).catch(e => {
                console.log("error in filtering", e)
            })
    }, [])

    return (
        <>
            <div className="bg-slate-200 h-screen">
                <div className="flex h-12" style={{ border: "1px solid grey" }}>
                    <div className="p-2 pl-6 font-serif font-bold text-xl">Payments App</div>
                    <div className=" flex absolute right-0 p-3 pr-16 font-serif font-semibold text-sm">
                        <div className="pr-2">Hello, {usernameAtomValue}</div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                            <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="m-6">
                    <div className="flex text-lg font-serif font-bold">
                        Your Balance : <div><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mt-1 ml-1">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        </div>{balanceAtomValue.toFixed(2)}
                    </div>
                </div>
                <div className="m-6">
                    <div className="text-lg font-serif font-bold">Users</div>
                    <div><input onChange={(e) => {
                        setFilter(e.target.value)
                    }} className="w-full h-8 mt-2 focus:outline-none shadow-md bg-slate-100 p-3" style={{ border: "1px solid grey" }} placeholder="Search users"></input></div>
                </div>
                <div className="m-6 mt-5">
                    {Array.isArray(users) ? users.map(user => {
                        if (user.firstname.includes(filter)) {
                            return (<Users user={user} key={user._id}></Users>)
                        }
                    }) : null}
                </div>
                
            </div>

        </>
    )
}

function Users({ user }) {
    return (
        <>
            <div className="mt-3">
                <div className="flex font-serif">
                    <div className="flex w-full">
                        <div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-2">
                            <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
                        </svg></div>
                        {user.firstname}</div>
                        <Modal key={user._id} username={user.firstname} ObjectId={user._id}></Modal>
                </div>
            </div>
        </>
    )
}