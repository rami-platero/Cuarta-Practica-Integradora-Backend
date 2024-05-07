import TicketDTO from "../dto/ticket.dto.js"

export default class TicketRepository {
    #dao
    constructor(dao){
        this.#dao = dao
    }

    create = async (total, purchaserEmail) => {
        const ticketDTO = new TicketDTO({total, purchaserEmail})
        return await this.#dao.create(ticketDTO)
    }
}