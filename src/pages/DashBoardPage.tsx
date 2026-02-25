import { useNavigate } from "react-router-dom";

const DashBoardPage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <div>
      {role === "ADMIN" && (
        <button
          onClick={() => navigate("/users")}
          className="border border-blue-300 rounded-md bg-blue-100 p-2 hover:bg-blue-200"
        >
          계정관리
        </button>
      )}
      <p>dashboard</p>
    </div>
  );
};

export default DashBoardPage;
