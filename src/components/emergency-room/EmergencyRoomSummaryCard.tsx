import type { EmergencyStatusSummary } from "../../types/emergency-room";

interface Props {
  summary: EmergencyStatusSummary;
}

function formatUpdatedAt(value: string | null) {
  if (!value) {
    return "업데이트 정보 없음";
  }

  return new Date(value).toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function EmergencyRoomSummaryCard({ summary }: Props) {
  return (
    <section className="summary-grid">
      <article className="summary-card">
        <span>조회 병원 수</span>
        <strong>{summary.totalHospitals}</strong>
      </article>
      <article className="summary-card">
        <span>가용 상태</span>
        <strong>{summary.greenCount}</strong>
      </article>
      <article className="summary-card">
        <span>혼잡 상태</span>
        <strong>{summary.redCount}</strong>
      </article>
      <article className="summary-card">
        <span>상태 미확인</span>
        <strong>{summary.unknownCount}</strong>
      </article>
      <article className="summary-card">
        <span>총 가용 병상</span>
        <strong>{summary.totalAvailableBeds}</strong>
      </article>
      <article className="summary-card">
        <span>최근 갱신 시각</span>
        <strong>{formatUpdatedAt(summary.latestStatusUpdatedAt)}</strong>
      </article>
    </section>
  );
}
