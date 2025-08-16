import React from 'react';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { Copy, History, CheckCircle } from 'lucide-react';

interface AutoCloneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'within-standard' | 'from-last-visit';
  standardCode?: string;
  schoolName?: string;
}

export const AutoCloneModal: React.FC<AutoCloneModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  standardCode,
  schoolName
}) => {
  const getTitle = () => {
    if (type === 'within-standard') {
      return `Auto-Fill Standard ${standardCode}`;
    }
    return 'Copy from Last Visit';
  };

  const getDescription = () => {
    if (type === 'within-standard') {
      return `Do you want to apply the same PLAN/DO/CHECK/ACT/Evidence to the rest of Standard ${standardCode}?`;
    }
    return `Do you want to copy answers from your last visit to ${schoolName}?`;
  };

  const getIcon = () => {
    if (type === 'within-standard') {
      return <Copy className="w-6 h-6 text-blue-500" />;
    }
    return <History className="w-6 h-6 text-green-500" />;
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <DialogTitle className="text-lg font-semibold">
              {getTitle()}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>All fields will be auto-filled</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>You can still edit any field after auto-fill</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Auto-filled fields will be marked with a badge</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose}>
            No, Continue Manually
          </Button>
          <Button onClick={handleConfirm} className="min-w-[120px]">
            Yes, Auto-Fill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
