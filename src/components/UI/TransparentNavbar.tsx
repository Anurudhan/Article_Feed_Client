import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../redux/hooks/useAuth';
import { Menu, X, User } from 'lucide-react';
import logo from '../../assets/knowaria_logo.png';
import ConfirmationModal from './ConfirmationModal';
import { useToast } from '../../contexts/ToastContext';
import { useAppDispatch } from '../../redux/hooks/hooks';
import { logoutUser } from '../../redux/actions/logoutUser';

// Define styles for reusability
const styles = {
  navLink: (isScrolled: boolean) =>
    `px-4 py-2 rounded-md text-base sm:text-sm font-semibold transition-colors duration-300 ${
      isScrolled
        ? 'bg-amber-200 text-amber-900 hover:bg-amber-300 border-amber-400'
        : 'bg-amber-700 text-white hover:bg-amber-600 border-amber-800'
    }`,
  mobileLink: (isScrolled: boolean) =>
    `w-full text-center py-3 text-base font-semibold transition-colors duration-300 ${
      isScrolled
        ? 'bg-amber-200 text-amber-900 hover:bg-amber-300'
        : 'bg-amber-700 text-white hover:bg-amber-600'
    }`,
  loginLink: (isScrolled: boolean) =>
    `px-4 py-2 rounded-md text-base sm:text-sm font-semibold transition-colors duration-300 shadow-sm ${
      isScrolled
        ? 'bg-amber-600 text-white hover:bg-amber-700'
        : 'bg-amber-600 text-white hover:bg-amber-700'
    }`,
  logoutLink: (isScrolled: boolean) =>
    `px-4 py-2 rounded-md text-base sm:text-sm font-semibold transition-colors duration-300 shadow-sm ${
      isScrolled
        ? 'bg-red-600 text-white hover:bg-red-700'
        : 'bg-red-600 text-white hover:bg-red-700'
    }`,
  menuIcon: (isScrolled: boolean) =>
    `h-7 w-7 ${isScrolled ? 'text-amber-700' : 'text-amber-100'}`,
};

const TransparentNavbar = () => {
  const user = useAuth();
  const {showToast}=useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate=useNavigate();
  const dispatch=useAppDispatch();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const confirmLogout = async () => {
  try {
    await dispatch(logoutUser()).unwrap();
    setIsModalOpen(false); 
    setIsMenuOpen(false); 
    showToast("Logout successful!", "success"); 
    navigate("/login"); 
  } catch (error) {
    const errorMessage = (error as { message: string }).message || "Unknown server error, please try again later.";
    showToast(errorMessage, "error"); // Show error toast with specific message
  }
};

  const cancelLogout = () => {
    setIsModalOpen(false);
  };

  // Common nav links for authenticated users
  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/myarticle', label: 'My Articles' },
    { to: '/create', label: 'Create Article' },
  ];

  // Render nav links (desktop or mobile)
  const renderNavLinks = (isMobile = false) =>
    user ? (
      <>
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={isMobile ? styles.mobileLink(isScrolled) : styles.navLink(isScrolled)}
            onClick={isMobile ? toggleMenu : undefined}
          >
            {label}
          </Link>
        ))}
        <div className="flex items-center space-x-3 py-2">
          <div className="w-9 h-9 rounded-full bg-amber-300 flex items-center justify-center">
            <User className="h-5 w-5 text-amber-700" />
          </div>
          <Link
            to="/profile"
            className={isMobile ? styles.mobileLink(isScrolled) : styles.navLink(isScrolled)}
            onClick={isMobile ? toggleMenu : undefined}
          >
            {user?.firstName || 'User'}
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className={isMobile ? styles.logoutLink(isScrolled) : styles.logoutLink(isScrolled)}
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <Link
          to="/register"
          className={isMobile ? styles.mobileLink(isScrolled) : styles.navLink(isScrolled)}
          onClick={isMobile ? toggleMenu : undefined}
        >
          Register
        </Link>
        <Link
          to="/login"
          className={isMobile ? styles.loginLink(isScrolled) : styles.loginLink(isScrolled)}
          onClick={isMobile ? toggleMenu : undefined}
        >
          Login
        </Link>
      </>
    );

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 px-4 py-3 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Knowaria Logo"
            className="h-12 sm:h-14 md:h-16 object-contain drop-shadow-md"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {renderNavLinks()}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="p-2 rounded-md">
            {isMenuOpen ? (
              <X className={styles.menuIcon(isScrolled)} />
            ) : (
              <Menu className={styles.menuIcon(isScrolled)} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-transparent transition-all duration-300">
          <div className="flex flex-col items-center py-4 space-y-2">
            {renderNavLinks(true)}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        confirmText="Logout"
        cancelText="Cancel"
      />
    </nav>
  );
};

export default TransparentNavbar;