function getTables(req, res) {
    let tables = []
    for (let i = 0; i < 15; i++) {
        tables.push({
            tableId: i,
            seats: Math.floor((Math.random() * 10) + 1),
            inUse: (Math.random() < 0.5)
        })
    }
    res.status(200).send(tables)
}
module.exports = ({ getTables })