import { useEffect, useState } from "react"
import axios from "axios"
import { useRecoilState } from "recoil"
import { toast, ToastContainer } from "react-toastify";
import { balanceAtom } from "../atom";


export default function Modal({username,ObjectId}) {
    const [transferAmount,setTransferAmount] = useState(0)
    const to = ObjectId
    const [balanceAtomValue,setBalanceAtom] = useRecoilState(balanceAtom)


    function transferAmountFunc(){
        const token = localStorage.getItem('token')
        axios.post("http://localhost:8080/api/v1/account/transfer",{
            to:to,
            amount:transferAmount
        },{
            headers:{
                "authorization":token
            }
        }).then((res)=>{
            setBalanceAtom(balanceAtomValue-transferAmount);
            toast.success("transfer successfull")
            
        }).catch(e=>{
            if(e.response.status==411){
                toast.warn("insuficient balance")
            }
            else if(e.response.status==410){
                toast.warn("invalid account")
            }
        })
    }

    return (
        <>
            <button className="text-sm bg-slate-950 text-white w-32 text-center h-8 rounded-sm grid place-content-center hover:bg-slate-800" onClick={() => document.getElementById('my_modal_1').showModal()}>Send Money</button>
            <dialog id="my_modal_1" className="modal rounded-lg">
                <div className="modal-box">
                    <h3 className="grid m-8 font-bold text-xl place-content-center">Send money</h3>
                    <div className="flex ml-6">
                        <div className=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-2">
                            <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
                        </svg></div>
                        <div className="font-semibold">{username}</div>
                    </div>
                    <div><div className="text-sm ml-6">Amount (in Rs)</div>
                        <div className="ml-6 mr-6 mt-1">
                            <input onChange={(e)=>{
                                setTransferAmount(e.target.value)
                            }} className="focus:outline-none p-1" placeholder="Enter amount" style={{border:"1px solid grey"}}></input>
                        </div>
                        <div className="grid place-content-center m-3 bg-slate-950 text-white rounded-md h-9 hover:bg-slate-800">
                            <button onClick={transferAmountFunc}>Initiate Transfer</button>
                        </div>
                    </div>
                    <div className="modal-action grid place-content-end m-5">
                        <form method="dialog">
                            <button className="btn rounded-md bg-slate-950 text-white p-1 w-16 hover:bg-slate-800">Close</button>
                        </form>
                    </div>
                </div>
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
            </dialog>
        </>
    )
}
