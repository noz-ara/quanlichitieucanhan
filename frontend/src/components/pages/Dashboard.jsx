import React from "react";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import DashboardLayout from "../ui/DashboardLayout";
import { useUser } from "../hooks/useUser"; 
import Users from "./users";

function Dashboard() {
  const { user } = useUser();
  const isAdmin = user?.role === "ROLE_ADMIN" || user?.role === "ADMIN";

  if (isAdmin) {
    return <Users />; 
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Thống kê chi tiêu</Heading>
        {/* <DashboardFilter /> */}
      </Row>
      <DashboardLayout />
    </>
  );
}

export default Dashboard;
