import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, CheckCircle, XCircle } from 'lucide-react';
import styles from './ScanQr.module.css';

const ScanQr = ({ isOpen, onClose, eventId }) => {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [resultModal, setResultModal] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    if (isOpen && !html5QrCodeRef.current && !resultModal) {
      startScanning();
    } else if (!isOpen && html5QrCodeRef.current) {
      stopScanning();
    }

    return () => {
      if (html5QrCodeRef.current) {
        stopScanning();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, resultModal]);

  // Resetear estados cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setResultModal(null);
      setHasScanned(false);
      setIsScanning(false);
    }
  }, [isOpen]);

  const startScanning = async () => {
    if (!scannerRef.current) return;
    
    try {
      const html5QrCode = new Html5Qrcode(scannerRef.current.id);
      html5QrCodeRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        { facingMode: 'environment' }, // Usar cámara trasera
        config,
        onScanSuccess,
        onScanError
      );

      setIsScanning(true);
    } catch (error) {
      console.error('Error al iniciar el escáner:', error);
      setResultModal({
        type: 'error',
        message: 'No se pudo acceder a la cámara. Por favor, verifica los permisos.'
      });
      await stopScanning();
    }
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (error) {
        console.error('Error al detener el escáner:', error);
      } finally {
        html5QrCodeRef.current = null;
        setIsScanning(false);
        setHasScanned(false);
      }
    }
  };

  const onScanSuccess = async (decodedText, decodedResult) => {
    if (hasScanned || resultModal) return; // Evitar múltiples escaneos

    setHasScanned(true);
    // Detener el escaneo inmediatamente
    await stopScanning();
    
    try {
      // Intentar parsear el JSON del QR
      const qrData = JSON.parse(decodedText);
      
      // Verificar que el QR contiene un eventId
      if (!qrData.eventId) {
        setResultModal({
          type: 'error',
          message: 'El código QR no contiene información válida del evento.'
        });
        return;
      }

      // Comparar el eventId del QR con el eventId del card (convertir ambos a string para comparación)
      const qrEventId = String(qrData.eventId);
      const cardEventId = String(eventId);
      
      if (qrEventId === cardEventId) {
        setResultModal({
          type: 'success',
          message: 'Tu asistencia ha sido confirmada.'
        });
      } else {
        setResultModal({
          type: 'error',
          message: 'El código QR no contiene información válida del evento.'
        });
      }
    } catch (error) {
      // Si no es JSON, intentar comparar directamente como string
      const decodedId = String(decodedText).trim();
      const cardId = String(eventId).trim();
      
      if (decodedId === cardId) {
        setResultModal({
          type: 'success',
          message: 'Tu asistencia ha sido confirmada.'
        });
      } else {
        setResultModal({
          type: 'error',
          message: 'El código QR no contiene información válida del evento.'
        });
      }
    }
  };

  const onScanError = (errorMessage) => {
    // Ignorar errores de "No QR code found" ya que es normal mientras se busca
    if (errorMessage.includes('No QR code found')) {
      return;
    }
    // Solo loguear otros errores sin mostrar toast para no saturar
    console.log('Error de escaneo:', errorMessage);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    stopScanning();
    setResultModal(null);
    setHasScanned(false);
    onClose();
  };

  const handleAcceptResult = () => {
    const modalType = resultModal?.type;
    setResultModal(null);
    
    if (modalType === 'success') {
      onClose();
    } else {
      // Si es error, permitir escanear de nuevo
      setHasScanned(false);
      startScanning();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={handleClose} aria-label="Cerrar modal">
          <X size={24} />
        </button>

        {resultModal ? (
          <div className={styles.resultModalContent}>
            <div className={styles.resultIconContainer}>
              {resultModal.type === 'success' ? (
                <CheckCircle size={64} className={styles.successIcon} />
              ) : (
                <XCircle size={64} className={styles.errorIcon} />
              )}
            </div>
            <h2 className={styles.resultTitle}>
              {resultModal.type === 'success' ? '¡Confirmado!' : 'Error'}
            </h2>
            <p className={styles.resultMessage}>
              {resultModal.message}
            </p>
            <button className={styles.acceptButton} onClick={handleAcceptResult}>
              Aceptar
            </button>
          </div>
        ) : (
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Escanear Código QR</h2>
            <p className={styles.modalSubtitle}>
              Apunta la cámara hacia el código QR del evento
            </p>

            <div className={styles.scannerContainer}>
              <div id="qr-reader" ref={scannerRef} className={styles.scanner}></div>
              {!isScanning && (
                <div className={styles.loadingOverlay}>
                  <p>Cargando cámara...</p>
                </div>
              )}
            </div>

            <div className={styles.instructions}>
              <p className={styles.instructionText}>
                Asegúrate de que el código QR esté completamente visible dentro del marco
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanQr;

