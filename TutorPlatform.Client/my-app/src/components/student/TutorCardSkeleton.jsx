export default function TutorCardSkeleton() {
  return (
    <div className="tutor-card tutor-card--skeleton">
      <div className="skeleton skeleton--avatar"></div>
      <div className="skeleton skeleton--line skeleton--lg"></div>
      <div className="skeleton skeleton--line"></div>
      <div className="skeleton skeleton--line skeleton--sm"></div>
      <div className="skeleton skeleton--btn"></div>
    </div>
  );
}