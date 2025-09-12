import api from "./api";

class BillService {
  static async create(billData) {
    const { data } = await api.post("/bills", billData);
    return data;
  }

  static async getMyBills() {
    const { data } = await api.get("/bills/my");
    return data;
  }

  // alias để tương thích các trang đang gọi listMy
  static async listMy() {
    return this.getMyBills();
  }

  static async getBillById(id) {
    const { data } = await api.get(`/bills/${id}`);
    return data;
  }

  static async deleteBill(id) {
    await api.delete(`/bills/${id}`);
    return { message: "Bill deleted successfully" };
  }
}

export default BillService;
