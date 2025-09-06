import { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaCar, FaUser, FaExclamationTriangle, FaChartBar, FaCog, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function TopbarCarousel() {
  const links = [
    { name: "Dashboard", to: "/", icon: <FaTachometerAlt /> },
    { name: "Vehicles", to: "/vehicles", icon: <FaCar /> },
    { name: "Drivers", to: "/drivers", icon: <FaUser /> },
    { name: "Alerts", to: "/alerts", icon: <FaExclamationTriangle /> },
    { name: "Reports", to: "/reports", icon: <FaChartBar /> },
    { name: "Settings", to: "/settings", icon: <FaCog /> },
  ];

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
    const scrollAmount = 100; // width of one item
    scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
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
    <div className="topbar-carousel-wrapper">
      {canScrollLeft && <div className="carousel-arrow left" onClick={() => scroll("left")}><FaChevronLeft /></div>}
      {canScrollRight && <div className="carousel-arrow right" onClick={() => scroll("right")}><FaChevronRight /></div>}

      <div className="topbar-carousel" ref={scrollRef}>
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            className={({ isActive }) => `carousel-link ${isActive ? "active" : ""}`}
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}