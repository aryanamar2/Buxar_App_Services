import React from 'react';
import {
  Wrench,
  Zap,
  Wind,
  Hammer,
  Sparkles,
  Tv,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

interface IconHelperProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<IconHelperProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Wrench':
      return <Wrench {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Wind':
      return <Wind {...props} />;
    case 'Hammer':
      return <Hammer {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'Tv':
      return <Tv {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
};
