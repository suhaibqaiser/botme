const clientStateObj = {
    pending: 'pending',
    active: 'active',
    disabled: 'disabled'
}

// predefined email sending types
const emailSendingTypes = {
    'place_order': 'place_order' // used when your has successfully placed his order
}


module.exports = ({clientStateObj, emailSendingTypes})
