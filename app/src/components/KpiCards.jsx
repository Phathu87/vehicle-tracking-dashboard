import { useRef, useState, useEffect } from "react";
import { 
  FaCar, FaWifi, FaExclamationTriangle, FaGasPump, 
  FaChevronLeft, FaChevronRight 
} from "react-icons/fa";

export default function KpiCards({ kpis }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 220; // width of one card + gap
    if (direction === "left") {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <div className="kpis-wrapper">
      {canScrollLeft && (
        <div className="kpi-arrow left" onClick={() => scroll("left")}>
          <FaChevronLeft />
        </div>
      )}
      {canScrollRight && (
        <div className="kpi-arrow right" onClick={() => scroll("right")}>
          <FaChevronRight />
        </div>
      )}

      <div className="kpis" ref={scrollRef}>
        <div className="kpi">
          <div className="kpi-icon"><FaCar /></div>
          <div className="kpi-label">Total Vehicles</div>
          <div className="kpi-value">{kpis.total}</div>
        </div>

        <div className="kpi">
          <div className="kpi-icon online"><FaWifi /></div>
          <div className="kpi-label">Online</div>
          <div className="kpi-value">{kpis.online}</div>
        </div>

        <div className="kpi">
          <div className="kpi-icon alert"><FaExclamationTriangle /></div>
          <div className="kpi-label">Active Alerts</div>
          <div className="kpi-value">{kpis.alerts}</div>
        </div>

        <div className="kpi">
          <div className="kpi-icon fuel"><FaGasPump /></div>
          <div className="kpi-label">Fuel Usage (L/100km)</div>
          <div className="kpi-value">{kpis.avgFuel}</div>
        </div>
      </div>
    </div>
  );
}