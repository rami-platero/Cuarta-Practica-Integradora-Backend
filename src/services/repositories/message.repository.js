export default class MessageRepository {
  constructor(dao){
    this.dao = dao
  }

  getAllMessages = async () => {
    return await this.dao.findAll()
  };

  createMessage = async (data) => {
    return await this.dao.create(data)
  };
}