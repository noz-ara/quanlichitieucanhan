import React from "react";
import styled from "styled-components";
import {
  FaExclamationTriangle,
  FaLightbulb,
  FaPiggyBank,
  FaChartPie,
} from "react-icons/fa";

const Card = styled.div`
  background-color: var(--color-grey-0);
  border-radius: 1rem;
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
  grid-column: 1 / span 4;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatBlock = styled.div`
  background: var(--color-grey-50);
  border-radius: 0.8rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .label {
    font-size: 15px;
    display: flex;
    justify-content: space-between;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 6px;
  background-color: #e5e7eb;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  transition: width 0.4s ease;
  background-color: ${({ color }) => color};
  width: ${({ width }) => width}%;
`;

const AdviceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  p {
    margin: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .warning {
    color: #dc2626;
    font-weight: 500;
  }

  .advice {
    color: #2563eb;
    font-weight: 500;
  }

  .solution {
    color: #16a34a;
    font-weight: 500;
  }
`;

function AdviceCard({ expenseSummary, incomeSummary }) {
  const totalIncome = incomeSummary?.totalThisMonth || 0;
  const grouped = expenseSummary?.grouped || { ESSENTIAL: 0, WANTS: 0 };

  if (totalIncome <= 0) {
    return (
      <Card>
        <Title>Phân tích & Lời khuyên</Title>
        <p style={{ color: "#dc2626" }}>
          <FaExclamationTriangle /> Chưa có thu nhập trong tháng này để phân tích.
        </p>
      </Card>
    );
  }

  // Lấy giá trị đã tính sẵn từ hook
  const x1_real = grouped.ESSENTIAL;
  const x2_real = grouped.WANTS;
  const x3_real = totalIncome - (x1_real + x2_real);

  // Mức tối ưu 50/30/20
  const x1_opt = 0.5 * totalIncome;
  const x2_opt = 0.3 * totalIncome;
  const x3_opt = totalIncome - x1_opt - x2_opt;

  // % so với mức tối ưu
  const x1_pct = ((x1_real / x1_opt) * 100).toFixed(1);
  const x2_pct = ((x2_real / x2_opt) * 100).toFixed(1);
  const x3_pct = ((x3_real / x3_opt) * 100).toFixed(1);

  let warnings = [];
  let advices = [];
  let solutions = [];

  if (x1_real > x1_opt) {
    warnings.push(`Chi tiêu thiết yếu vượt ${x1_pct}% so với mức tối ưu.`);
    advices.push(
      `Cân nhắc giảm bớt chi phí ăn uống, đi lại hoặc tiền nhà để đưa về mức ~50% thu nhập.`
    );
    solutions.push(
      `Cắt giảm khoảng ${(x1_real - x1_opt).toLocaleString()}₫ trong nhóm thiết yếu.`
    );
  }

  if (x2_real > x2_opt) {
    warnings.push(`Chi tiêu mong muốn vượt ${x2_pct}% so với mức tối ưu.`);
    advices.push(
      `Giảm tần suất mua sắm, giải trí hoặc đặt ngân sách cứng cho nhóm mong muốn.`
    );
    solutions.push(
      `Giảm khoảng ${(x2_real - x2_opt).toLocaleString()}₫ để tăng tiết kiệm.`
    );
  }

  if (x3_real < x3_opt) {
    warnings.push(`Tiết kiệm hiện tại chỉ đạt ${x3_pct}% mục tiêu.`);
    advices.push(
      `Tăng tiết kiệm để đạt chuẩn 20% thu nhập nhằm bảo đảm quỹ dự phòng.`
    );
    solutions.push(
      `Tiết kiệm thêm ${(x3_opt - x3_real).toLocaleString()}₫ để đạt mức khuyến nghị.`
    );
  }

  if (warnings.length === 0) {
    advices.push("Bạn đang chi tiêu cân đối theo nguyên tắc 50/30/20 (50% cho nhu cầu thiết yếu, 30% cho mong muốn, 20% để tiết kiệm/đầu tư. Mục tiêu là đảm bảo bạn vẫn có khoản dự phòng và đầu tư cho tương lai). Hãy duy trì!");
    solutions.push("Tiếp tục duy trì mức chi tiêu và tiết kiệm như hiện tại.");
  }

  return (
    <Card>
      <Title>
        <FaChartPie /> Phân tích thu chi tháng này
      </Title>

      {/* Thống kê chi tiết với progress bar */}
      <StatBlock>
        <div className="stat">
          <div className="label">
            <span>Chi tiêu thiết yếu</span>
            <span>{x1_real.toLocaleString()}₫ ({x1_pct}% mục tiêu)</span>
          </div>
          <ProgressBar>
            <ProgressFill
              color={x1_real > x1_opt ? "#dc2626" : "#f97316"}
              width={Math.min((x1_real / x1_opt) * 100, 120)}
            />
          </ProgressBar>
        </div>
        <div className="stat">
          <div className="label">
            <span>Chi tiêu mong muốn</span>
            <span>{x2_real.toLocaleString()}₫ ({x2_pct}% mục tiêu)</span>
          </div>
          <ProgressBar>
            <ProgressFill
              color={x2_real > x2_opt ? "#dc2626" : "#3b82f6"}
              width={Math.min((x2_real / x2_opt) * 100, 120)}
            />
          </ProgressBar>
        </div>
        <div className="stat">
          <div className="label">
            <span>Tiết kiệm</span>
            <span>{x3_real.toLocaleString()}₫ ({x3_pct}% mục tiêu)</span>
          </div>
          <ProgressBar>
            <ProgressFill
              color={x3_real < x3_opt ? "#dc2626" : "#16a34a"}
              width={Math.min((x3_real / x3_opt) * 100, 120)}
            />
          </ProgressBar>
        </div>
      </StatBlock>

      {/* Cảnh báo & lời khuyên */}
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
        {solutions.length > 0 && (
          <>
            <Title>
              <FaPiggyBank /> Giải pháp đề xuất
            </Title>
            {solutions.map((s, idx) => (
              <p key={`s-${idx}`} className="solution">
                {s}
              </p>
            ))}
          </>
        )}
      </AdviceList>
    </Card>
  );
}

export default AdviceCard;
