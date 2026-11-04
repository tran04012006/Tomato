import "../styles/ProfileGrid.css";

const ProfileGrid = () => {
  const stats = [
    {
      id: 1,
      icon: "🍅",
      value: 12,
      label: "Focus sessions",
    },
    {
      id: 2,
      icon: "⏱️",
      value: 300,
      label: "Focus minutes",
    },
    {
      id: 3,
      icon: "✅",
      value: 8,
      label: "Tasks completed",
    },
  ];
  return (
    <div id="profile_grid">
      {stats.map((stat) => (
        <div id="profile_stat_card" key={stat.id}>
          <div id="profile_stat_icon">{stat.icon}</div>

          <strong>{stat.value}</strong>

          <span>{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ProfileGrid;
