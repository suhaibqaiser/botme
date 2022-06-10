const accountStateObj = {
    pending: 'pending',
    active: 'active',
    disabled: 'disabled'
}

const accountStateList = ['pending', 'active', 'disabled']

const stakeholdersList = ['customer', 'device', 'user']
const stakeholdersObj = {
    customer: 'customer',
    device: 'device',
    user: 'user'
}
// predefined email sending types
const emailSendingTypes = {
    'place_order': 'place_order' // used when your has successfully placed his order
}




module.exports = ({
    accountStateObj,
    emailSendingTypes,
    accountStateList,
    stakeholdersList,
    stakeholdersObj
})
