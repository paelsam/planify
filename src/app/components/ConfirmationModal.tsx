import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Info, Trash2, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantConfig = {
    danger: {
      icon: Trash2,
      iconBg: '#EF4444',
      confirmBg: '#EF4444',
      confirmHover: '#DC2626',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: '#F59E0B',
      confirmBg: '#F59E0B',
      confirmHover: '#D97706',
    },
    info: {
      icon: Info,
      iconBg: '#3B82F6',
      confirmBg: '#3B82F6',
      confirmHover: '#2563EB',
    },
  };

  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white border-4 border-black p-6 max-w-md w-full"
            style={{ boxShadow: '12px 12px 0px 0px #000000' }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white border-4 border-black p-2 hover:bg-gray-100"
              style={{ boxShadow: '4px 4px 0px 0px #000000' }}
            >
              <X size={20} strokeWidth={3} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div
                className="border-4 border-black p-4"
                style={{
                  backgroundColor: config.iconBg,
                  boxShadow: '6px 6px 0px 0px #000000',
                }}
              >
                <IconComponent size={40} strokeWidth={3} className="text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="font-black text-2xl text-center mb-4 uppercase">
              {title}
            </h2>

            {/* Message */}
            <p className="text-center font-bold mb-8 text-gray-700">
              {message}
            </p>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onClose}
                className="bg-white text-black border-4 border-black p-3 font-black uppercase hover:bg-gray-100 transition-colors"
                style={{ boxShadow: '4px 4px 0px 0px #000000' }}
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className="text-white border-4 border-black p-3 font-black uppercase transition-colors"
                style={{
                  backgroundColor: config.confirmBg,
                  boxShadow: '4px 4px 0px 0px #000000',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = config.confirmHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = config.confirmBg;
                }}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}