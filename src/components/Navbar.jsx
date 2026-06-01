import { useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    { path: '/', label: '홈', icon: '🏠' },
    { path: '/realtime', label: '실시간 재고', icon: '🔴' },
    { path: '/manage', label: '재고관리', icon: '📋' },
    
    { path: '/setting', label: '설정', icon: '⚙️' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16">
      {menus.map((menu) => (
        <button
          key={menu.path}
          onClick={() => navigate(menu.path)}
          className={`flex flex-col items-center text-xs gap-1 ${
            location.pathname === menu.path
              ? 'text-blue-500 font-bold'
              : 'text-gray-400'
          }`}
        >
          <span className="text-xl">{menu.icon}</span>
          {menu.label}
        </button>
      ))}
    </div>
  );
}

export default Navbar;