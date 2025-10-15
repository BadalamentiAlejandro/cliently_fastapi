import { useEffect, useState } from 'react';

const Toast = ({ message, type, isVisible, onClose }) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true); // Activa animación de entrada
      const timer = setTimeout(() => {
        setShowAnimation(false); // Inicia animación de salida
        // Espera a que termine la animación (0.5s) antes de cerrar
        setTimeout(() => {
          onClose();
        }, 500);
      }, 3000); // Tiempo visible antes de empezar a desaparecer

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const getBackgroundColor = () => {
    return type === 'success' ? 'bg-green-600' : 'bg-red-600';
  };

  return (
    <div
      className={`fixed bottom-[calc(10vh)] left-4 z-50 p-3 rounded-md shadow-lg text-white transition-all duration-500 ease-in-out transform -translate-x-1/2 ${getBackgroundColor()} ${
        showAnimation ? 'translate-x-5 opacity-100' : 'translate-x-0 opacity-0'
      }`}
    >
      <div className="flex items-center gap-2">
        <span>{type === 'success' ? '✅' : '❌'}</span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
