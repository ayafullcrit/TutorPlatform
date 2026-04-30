import { useState, useEffect } from "react";
import TutorCard from "../../components/student/TutorCard";
import TutorCardSkeleton from "../../components/student/TutorCardSkeleton";
import EmptyState from "../../components/student/EmptyState";
import ErrorState from "../../components/student/ErrorState";
import { searchTutors } from "../../services/tutorService";

export default function FindTutor() {
  const [tutors, setTutors] = useState([]);
  const [status, setStatus] = useState("loading");
  const [filters, setFilters] = useState({
    subject: "",
    minRating: 0,
    searchTerm: "",
  });

  useEffect(() => {
    loadTutors();
  }, [filters]);

  const loadTutors = async () => {
    setStatus("loading");
    try {
      const result = await searchTutors(filters);
      if (result.data) {
        setTutors(result.data);
        setStatus(result.data.length === 0 ? "empty" : "success");
      } else {
        setStatus("empty");
      }
    } catch (error) {
      console.error("Failed to load tutors:", error);
      setStatus("error");
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleRetry = () => {
    loadTutors();
  };

  return (
    <div className="student-find-tutor">
      <div className="student-dashboard__hero">
        <div>
          <h1 className="student-dashboard__heading">Tìm kiếm gia sư phù hợp</h1>
          <p className="student-dashboard__subtext">
            Dựa trên mục tiêu học tập của bạn.
          </p>
        </div>

        <button className="student-dashboard__primary-btn">
          <span className="material-symbols-outlined">filter_alt</span>
          Lọc theo môn
        </button>
      </div>

      {status === "loading" && (
        <div className="student-find-tutor__grid">
          <TutorCardSkeleton />
          <TutorCardSkeleton />
          <TutorCardSkeleton />
        </div>
      )}

      {status === "empty" && <EmptyState />}

      {status === "error" && <ErrorState onRetry={handleRetry} />}

      {status === "success" && (
        <div className="student-find-tutor__grid">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      )}
    </div>
  );
}