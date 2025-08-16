import React from 'react';
import { Badge } from './badge';
import { Copy } from 'lucide-react';

interface AutoFilledBadgeProps {
  className?: string;
}

export const AutoFilledBadge: React.FC<AutoFilledBadgeProps> = ({ className = '' }) => {
  return (
    <Badge 
      variant="secondary" 
      className={`bg-blue-50 text-blue-700 border-blue-200 text-xs ${className}`}
    >
      <Copy className="w-3 h-3 mr-1" />
      Auto-Filled
    </Badge>
  );
};
