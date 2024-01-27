const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const {Account,User} = require("./user")
const { authMiddleware } = require("../middleware")


router.get("/balance",authMiddleware,async(req,res)=>{
    const account = await Account.findOne({
        userId:req.userId
    })

    res.status(201).json({
        balance:account.balance
    })
})

router.post("/transfer",authMiddleware,async(req,res)=>{

    const session = await mongoose.startSession();
    session.startTransaction();

    const {to,amount} = req.body
    const account =await Account.findOne({
        userId:req.userId
    }).session(session)

    if(!account || parseInt(account.balance)<parseInt(amount)){
        await session.abortTransaction();
        return res.status(411).json({
            msg:"insuficient balance"
        })
    }
    const toAccount = User.findOne({
        userId:to
    }).session(session)

    if(!toAccount){
        await session.abortTransaction();
        return res.status(410).json({
            msg:"invalid account"
        })
    }

    await Account.updateOne({
        userId:req.userId
    },{
        $inc:{
            balance:-amount
        }
    }).session(session)

    await Account.updateOne({
        userId:to
    },{
        $inc:{
            balance:amount
        }
    }).session(session)

    await session.commitTransaction();

    res.status(200).json({
        msg:"Transfer successful"
    })

    
})

module.exports = router