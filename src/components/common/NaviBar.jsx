import { useNavigate, useLocation } from "react-router-dom";

function NaviBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname.startsWith(path);

    const navItems = [
        { label: "홈", path: "/home", icon: "🏠" },
        { label: "기록", path: "/diary", icon: "✎" },
        { label: "책", path: "/ebook", icon: "📖" },
        { label: "커뮤니티", path: null, icon: "👥" },
        { label: "설정", path: "/mypage", icon: "⚙️" },
    ];

    return (
        <div
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                padding: "10px 0",
                backgroundColor: "#fff",
                borderTop: "1px solid #eee",
            }}
        >
            {navItems.map((item) => (
                <div
                    key={item.label}
                    onClick={() => item.path && navigate(item.path)}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        cursor: item.path ? "pointer" : "default",
                        color: item.path && isActive(item.path) ? "#ff8a65" : "#999",
                    }}
                >
                    <span style={{ fontSize: "20px" }}>{item.icon}</span>
                    <span style={{ fontSize: "12px" }}>{item.label}</span>
                </div>
            ))}
        </div>
    );
}

export default NaviBar;