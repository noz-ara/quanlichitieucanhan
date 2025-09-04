import api from "./api";

class UserService {
  // Lấy danh sách user (admin)
  static async fetchUsers() {
    const { data } = await api.get("/admin/users");
    return data;
  }

  // Tạo mới user
  static async createUser(userData) {
    const formData = new FormData();

    // user info
    formData.append(
      "user",
      new Blob(
        [
          JSON.stringify({
            username: userData.username,
            email: userData.email,
            password: userData.password,
            role: userData.role || "USER",
          }),
        ],
        { type: "application/json" }
      )
    );

    // profile image
    if (userData.profileImage?.[0]) {
      formData.append("profileImage", userData.profileImage[0]);
    }

    const { data } = await api.post("/admin/users", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  }

  // Update user
  static async updateUser(userId, userData) {
    const formData = new FormData();
    formData.append(
      "userDetails",
      new Blob(
        [
          JSON.stringify({
            username: userData.username,
            email: userData.email,
            password: userData.password,
            role: userData.role || "USER",
          }),
        ],
        { type: "application/json" }
      )
    );

    if (userData.profileImage?.[0]) {
      formData.append("profileImage", userData.profileImage[0]);
    }

    const { data } = await api.put(`/admin/users/${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  }

  // Xóa user
  static async deleteUser(userId) {
    await api.delete(`/admin/users/${userId}`);
  }
}

export default UserService;
