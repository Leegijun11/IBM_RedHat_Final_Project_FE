import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/NaviBar.css"; 

function NaviBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => path && location.pathname.startsWith(path);

    const navItems = [
        { label: "홈",       path: "/home",   icon: "🏠" },
        { label: "기록",     path: "/diary",  icon: "✎"  },
        { label: "책",       path: "/ebook",  icon: "📖" },
        { label: "커뮤니티",  path: "/comm",   icon: "👥" },
        { label: "설정",     path: "/mypage", icon: "⚙️" },
    ];

    return (
        <div className="navibar-wrap">
            {navItems.map((item) => (
                <div
                    key={item.label}
                    className={`navibar-item ${isActive(item.path) ? "active" : ""}`}
                    onClick={() => item.path && navigate(item.path)}
                >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

export default NaviBar;