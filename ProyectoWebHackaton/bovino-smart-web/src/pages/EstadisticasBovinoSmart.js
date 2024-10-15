import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Chart from "chart.js/auto";
import emailjs from "emailjs-com";
import * as XLSX from "xlsx";
import { FaFileExcel, FaChartLine , FaRegFilePdf, FaEnvelopeCircleCheck } from "react-icons/fa6";

function EstadisticasBovinoSmart() {
  const [produccionLeche, setProduccionLeche] = useState([]);
  const produccionLecheChartRef = useRef(null);

  // Llamada a la API para obtener datos de producción de leche para todos los registros
  const fetchProduccionLeche = async () => {
    try {
      const response = await fetch('http://localhost:5000/crud/produccion_leche'); // Cambiado para obtener todos los registros
      const data = await response.json();
      console.log("Datos obtenidos de la API:", data); // Verifica los datos en la consola
      setProduccionLeche(data);
    } catch (error) {
      console.error('Error al obtener los datos de producción de leche:', error);
    }
  };

  useEffect(() => {
    fetchProduccionLeche();
  }, []);

  useEffect(() => {
    if (produccionLeche.length > 0) {
      if (produccionLecheChartRef.current !== null) {
        produccionLecheChartRef.current.destroy();
      }
      createProduccionLecheChart();
    }
  }, [produccionLeche]);

  const createProduccionLecheChart = () => {
    const ctx = document.getElementById("produccionLecheChart");
    if (!ctx) {
      return;
    }

    const labels = produccionLeche.map(item => formatearFecha(item.fecha)); // Formatea las fechas
    const data = produccionLeche.map(item => item.cantidad);
    
    console.log("Etiquetas para el gráfico:", labels); // Verifica las etiquetas
    console.log("Datos para el gráfico:", data); // Verifica los datos

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Producción de Leche (litros)",
            data: data,
            fill: false,
            borderColor: "rgba(75, 192, 192, 1)",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value + " L";
              }
            }
          }
        },
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Producción de Leche por Fecha" },
        },
      },
    });

    produccionLecheChartRef.current = chart;
  };

  // Función para exportar a Excel
  const exportarProduccionLecheAExcel = () => {
    // Formatear las fechas antes de exportar
    const produccionLecheFormateada = produccionLeche.map((item) => ({
      ...item,
      fecha: formatearFecha(item.fecha), // Formatear la fecha a DD/MM/YYYY
    }));

    const worksheet = XLSX.utils.json_to_sheet(produccionLecheFormateada);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Producción de Leche");
    XLSX.writeFile(workbook, "ProduccionLeche.xlsx");
  };

  // Función para generar reporte PDF
  const generarReporteProduccionLechePDF = async () => {
    try {
      const canvas = await html2canvas(document.getElementById("produccionLecheChart"));
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL("image/png");
      pdf.text("Reporte de Producción de Leche", 20, 10);
      pdf.addImage(imgData, "PNG", 10, 20, 100, 100);
      pdf.save("reporte_produccion_leche.pdf");
    } catch (error) {
      console.error("Error al generar el reporte PDF:", error);
    }
  };

  // Función para formatear la fecha a DD/MM/YYYY
  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha); // Convertir a objeto Date
    const fechaFormateada = `${fechaObj.getDate().toString().padStart(2, '0')}/${(fechaObj.getMonth() + 1).toString().padStart(2, '0')}/${fechaObj.getFullYear()}`; // Formato DD/MM/YYYY
    return fechaFormateada;
  };

  // Función para formatear los datos de producción de leche
  const formatearDatosProduccionLeche = (produccionLeche) => {
    return produccionLeche
      .map((item) => {
        const fechaFormateada = formatearFecha(item.fecha); // Formatear la fecha
        return `Fecha: ${fechaFormateada}\nCantidad: ${item.cantidad} litros`;
      })
      .join("\n\n");
  };

  // Función para enviar correo
  const enviarReporteProduccionLechePorCorreo = () => {
    const produccionLecheFormateada = formatearDatosProduccionLeche(produccionLeche);

    const data = {
      subject: "Reporte de Producción de Leche",
      to_name: "Ganadero",
      user_email: "yg97507@gmail.com",
      message: produccionLecheFormateada, // Aquí van los datos formateados
    };

    emailjs
      .send("service_4eaqwgf", "template_7u1g0ws", data, "voWjHjK7IiuJZpcKp")
      .then((response) => {
        alert("Correo enviado.");
        console.log("Correo enviado.", response);
      })
      .catch((error) => {
        alert("Error al enviar el correo.");
        console.error("Error al enviar el correo:", error);
      });
  };

  return (
    <Container>
      <Row className="g-3">
        <Col sm="12" md="6">
          <Card>
            <Card.Body>
              <Card.Title>Producción de Leche</Card.Title>
              <canvas id="produccionLecheChart" height="250"></canvas>
            </Card.Body>
            <Card.Body>
              <Button onClick={generarReporteProduccionLechePDF} className="btn btn-success m-1">
                <FaRegFilePdf style={{ color: "white" }} />
              </Button>
              <Button variant="secondary" onClick={enviarReporteProduccionLechePorCorreo} className="m-1">
                <FaEnvelopeCircleCheck style={{ color: "white" }} />
              </Button>
              <Button variant="success" onClick={exportarProduccionLecheAExcel} className="m-1">
                <FaFileExcel style={{ color: "white" }} />
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EstadisticasBovinoSmart;
