import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer } from 'lucide-react';
import styles from './ModalQr.module.css';

export default function ModalQr({ isOpen, onClose, eventId, eventTitle }) {
  const qrRef = useRef(null);

  if (!isOpen) return null;

  // Crear un objeto JSON con la información del evento
  const qrData = JSON.stringify({
    eventId: eventId,
    type: 'event_registration',
    timestamp: new Date().toISOString()
  });

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrint = () => {
    let qrSVG = '';
    if (qrRef.current) {
      const svgElement = qrRef.current.querySelector('svg');
      if (svgElement) {
        // Clonar el SVG para evitar problemas de referencia
        qrSVG = svgElement.cloneNode(true).outerHTML;
      }
    }

    if (!qrSVG) {
      alert('No se pudo obtener el código QR. Por favor, inténtalo de nuevo.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permite las ventanas emergentes para imprimir');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Evento - ${eventTitle || 'Eventify'}</title>
          <meta charset="UTF-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Poppins', sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 2rem;
              background: white;
            }
            .print-container {
              text-align: center;
              max-width: 400px;
              width: 100%;
            }
            .print-title {
              font-size: 1.5rem;
              font-weight: 700;
              color: #0B72B9;
              margin-bottom: 1rem;
            }
            .print-event-title {
              font-size: 1.1rem;
              font-weight: 600;
              color: #E11D9E;
              margin-bottom: 1.5rem;
            }
            .qr-container {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 2rem 0;
              padding: 1rem;
              border: 2px solid #000;
              border-radius: 8px;
            }
            .qr-container svg {
              width: 300px;
              height: 300px;
              max-width: 100%;
            }
            .print-instruction {
              font-size: 1.1rem;
              font-weight: 600;
              color: #111827;
              margin: 2rem 0 1rem;
              line-height: 1.6;
            }
            .print-hint {
              font-size: 0.85rem;
              color: #6B7280;
              line-height: 1.6;
              margin-top: 1rem;
            }
            @media print {
              body {
                padding: 1rem;
              }
              .print-container {
                page-break-inside: avoid;
              }
              @page {
                margin: 1cm;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <h1 class="print-title">Código QR del Evento</h1>
            ${eventTitle ? `<p class="print-event-title">${eventTitle}</p>` : ''}
            <div class="qr-container">
              ${qrSVG}
            </div>
            <p class="print-instruction">
              Lee este QR desde la app de Eventify para confirmar la asistencia al evento.
            </p>
            <p class="print-hint">
              Encuentra el botón de leer QR en la card de este evento cerca del título.
            </p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Esperar a que el contenido se cargue antes de imprimir
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer} >
        <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar modal">
          <X size={24} />
        </button>
       
        <div className={styles.modalContent}>
          <h2 className={styles.modalTitle}>Código QR del Evento</h2>
          <div className={styles.qrWrapper} ref={qrRef}>
            <QRCodeSVG
              value={qrData}
              size={256}
              level="L"
              includeMargin={true}
              className={styles.qrCode}
            />
          </div>
          
          <div className={styles.textSection}>
            {eventTitle && (
              <p className={styles.eventTitle}>{eventTitle}</p>
            )}
            <p className={styles.instructionText}>
              Muestra este código QR a tus invitados para que puedan confirmar su asistencia al evento.
            </p>
          </div>

          <button className={styles.printButton} onClick={handlePrint}>
            <Printer size={18} />
            Imprimir QR
          </button>
        </div>
      </div>
    </div>
  );
}

