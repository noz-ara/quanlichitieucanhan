import api from "./api";

class ContactService {
  // Tạo mới contact
  static async create(contact) {
    const { data } = await api.post("/contacts", contact);
    return data;
  }

  // Lấy danh sách contact của user
  static async listMy() {
    const { data } = await api.get("/contacts/my");
    return data;
  }

  // Lấy contact theo id
  static async getById(id) {
    const { data } = await api.get(`/contacts/${id}`);
    return data;
  }

  // Xóa contact
  static async remove(id) {
    await api.delete(`/contacts/${id}`);
  }
}

export default ContactService;
