import Ticket from "../models/ticket.model.js"

export default class TicketMongo {
    create = async (data) => {
        return (await Ticket.create(data)).toObject()
    }
}