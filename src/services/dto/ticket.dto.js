export default class TicketDTO {
  constructor(ticket) {
    this.purchaser = ticket.purchaserEmail;
    this.amount = ticket.total;
  }
}
