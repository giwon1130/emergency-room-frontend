import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Public GIS Service</p>
        <h1>실시간 응급실 병상 제공 서비스</h1>
        <p className="hero-copy">
          사용자 위치 기반으로 주변 응급실 병상 상태를 빠르게 조회할 수 있는 위치 기반 공공 정보 서비스다.
        </p>
        <Link className="primary-link" to="/emergency-room">
          응급실 지도 보기
        </Link>
      </section>
    </main>
  );
}

