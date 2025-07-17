const Dashboard = () => {
  return (
    <div className="pt-80 flex flex-col justify-center items-center bg-gradient-azure overflow-hidden px-4">
      <h2 className="text-6xl font-extrabold text-white tracking-wide font-rounded animate-moveUpDown">
        PANEL ADMINISTRATIVO
      </h2>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap');

        .font-rounded {
          font-family: 'Montserrat', sans-serif;
          border-radius: 0.5rem;
        }

        @keyframes moveUpDown {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-moveUpDown {
          animation: moveUpDown 3s ease-in-out infinite;
        }

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
