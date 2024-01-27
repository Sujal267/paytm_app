import {atom} from "recoil"

export const usernameAtom = atom({
    key:"usernameAtom",
    default:"user"
})

export const balanceAtom = atom({
    key:"balanceAtom",
    default:0
})