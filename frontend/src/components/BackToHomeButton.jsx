import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';

export default function BackToHomeButton() {
  const { user } = useAuth();
  const homeLink = user ? '/dashboard' : '/';

  return (
    <Link to={homeLink}>
      <Button variant="outline" className="gap-2">
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Back Home</span>
      </Button>
    </Link>
  );
}
