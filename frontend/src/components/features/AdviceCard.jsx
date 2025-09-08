import React from "react";
import styled from "styled-components";import { FaExclamationTriangle, FaLightbulb } from "react-icons/fa";

const Card = styled.div`
  background-color: var(--color-grey-0);
  border-radius: 1rem;
  box-shadow: var(--shadow-md);
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AdviceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  p {
    margin: 0;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .warning {
    color: #dc2626; /* đỏ */
    font-weight: 500;
  }

  .advice {
    color: #2563eb; /* xanh */
    font-weight: 500;
  }
`;

function AdviceCard({ expenseSummary, incomeSummary }) {
  const totalIncome = incomeSummary?.totalThisMonth || 0;
  const totalExpense = expenseSummary?.totalThisMonth || 0;

  const saving = totalIncome - totalExpense;
  const ratio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

  let warnings = [];
  let advices = [];

  if (ratio > 80) {
    warnings.push("Chi tiêu của bạn đã vượt 80% thu nhập tháng này!");
    advices.push("Hãy cân nhắc giảm chi hoặc đặt hạn mức chi tiêu.");
  }

  if (saving < totalIncome * 0.1) {
    warnings.push("Khoản tiết kiệm < 10% thu nhập.");
    advices.push("Bạn nên ưu tiên tiết kiệm ít nhất 20% mỗi tháng.");
  }

  if (warnings.length === 0) {
    advices.push("Tài chính tháng này đang khá cân đối 👍. Hãy duy trì!");
  }

  return (
    <Card>
      <Title>Phân tích & Lời khuyên</Title>
      <AdviceList>
        {warnings.map((w, idx) => (
          <p key={`w-${idx}`} className="warning">
            <FaExclamationTriangle /> {w}
          </p>
        ))}
        {advices.map((a, idx) => (
          <p key={`a-${idx}`} className="advice">
            <FaLightbulb /> {a}
          </p>
        ))}
      </AdviceList>
    </Card>
  );
}

export default AdviceCard;
