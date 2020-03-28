const Account = require('../models/account-model')
const request = require('request')

recordAccount = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide an account.',
        })
    }

    const account = new Account(body)

    if (!account) {
        return res.status(400).json({ success: false, error: err })
    }

    account
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: account._id,
                account: account.accountRS,
                message: 'Account info stored!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Error saving account info!',
            })
        })
}

updateAccount = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Account.findOne({ account: req.params.id }, (err, account) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Account not found!',
            })
        }
        account.signature = body.signature
        account.type = body.type
        account.accountRS = body.accountRS
        account
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: account.accountRS,
                    account: account.balanceNQT,
                    message: 'Account updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Account not updated!',
                })
            })
    })
}

getAccount = async (req, res) => {
    await Account.findOne({ accountRS: req.params.id }, (err, account) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!account) {
            return res
                .status(404)
                .json({ success: false, error: `Account not found!` })
        }
        return res.status(200).json({ success: true, data: account })
    }).catch(err => console.log(err))
}

getAccountTxs = async (req, res) => {
    await Account.find({}, (err, accounts) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!accounts.length) {
            return res
                .status(404)
                .json({ success: false, error: `Account transactions not found` })
        }
        return res.status(200).json({ success: true, data: accounts })
    }).catch(err => console.log(err))
}

module.exports = {
    recordAccount,
    updateAccount,
    getAccountTxs,
    getAccount,
}
