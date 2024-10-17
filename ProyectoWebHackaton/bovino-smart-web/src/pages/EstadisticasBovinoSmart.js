import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Chart from "chart.js/auto";
import emailjs from "emailjs-com";
import * as XLSX from "xlsx";
import { FaFileExcel, FaRegFilePdf, FaEnvelopeCircleCheck } from "react-icons/fa6";
import Header from '../components/Header'; 

function EstadisticasBovinoSmart() {
  const [produccionLeche, setProduccionLeche] = useState([]);
  const [pesoAnimales, setPesoAnimales] = useState([]);
  const produccionLecheChartRef = useRef(null);
  const pesoAnimalesChartRef = useRef(null);

  // Llamada a la API para obtener datos de producción de leche
  const fetchProduccionLeche = async () => {
    try {
      const response = await fetch('http://localhost:5000/crud/produccion_leche');
      const data = await response.json();
      setProduccionLeche(data);
    } catch (error) {
      console.error('Error al obtener los datos de producción de leche:', error);
    }
  };

  // Llamada a la API para obtener datos del peso de los animales
  const fetchPesoAnimales = async () => {
    try {
      const response = await fetch('http://localhost:5000/crud/peso_animales');
      const data = await response.json();
      setPesoAnimales(data);
    } catch (error) {
      console.error('Error al obtener los datos del peso de los animales:', error);
    }
  };

  useEffect(() => {
    fetchProduccionLeche();
    fetchPesoAnimales();
  }, []);

  // Crear el gráfico de producción de leche
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
    if (!ctx) return;

    const labels = produccionLeche.map(item => formatearFecha(item.fecha));
    const data = produccionLeche.map(item => item.cantidad);

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
              callback: function (value) {
                return value + " L";
              },
            },
          },
        },
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Producción de Leche por Fecha" },
        },
      },
    });

    produccionLecheChartRef.current = chart;
  };

  // Crear el gráfico de peso de los animales
useEffect(() => {
  if (pesoAnimales.length > 0) {
    if (pesoAnimalesChartRef.current !== null) {
      pesoAnimalesChartRef.current.destroy();
    }
    createPesoAnimalesChart();
  }
}, [pesoAnimales]);

const createPesoAnimalesChart = () => {
  const ctx = document.getElementById("pesoAnimalesChart");
  if (!ctx) return;

  const labels = pesoAnimales.map(item => item.nombre);  // Usamos el nombre del animal
  const data = pesoAnimales.map(item => item.peso_actual);  // Usamos el peso actual

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Peso de Animales (kg)",
          data: data,
          backgroundColor: "rgba(153, 102, 255, 0.6)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value + " kg";
            },
          },
        },
      },
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Peso de Animales" },
      },
    },
  });

  pesoAnimalesChartRef.current = chart;
};
  // Función para exportar datos de producción a Excel
  const exportarProduccionLecheAExcel = () => {
    const produccionLecheFormateada = produccionLeche.map((item) => ({
      ...item,
      fecha: formatearFecha(item.fecha),
    }));

    const worksheet = XLSX.utils.json_to_sheet(produccionLecheFormateada);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Producción de Leche");
    XLSX.writeFile(workbook, "ProduccionLeche.xlsx");
  };

  // Función para generar PDF del gráfico
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

  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    return `${fechaObj.getDate().toString().padStart(2, '0')}/${(fechaObj.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${fechaObj.getFullYear()}`;
  };

  return (
    
    <Container>
        <Header /> 
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
              <Button variant="secondary" className="m-1">
                <FaEnvelopeCircleCheck style={{ color: "white" }} />
              </Button>
              <Button variant="success" onClick={exportarProduccionLecheAExcel} className="m-1">
                <FaFileExcel style={{ color: "white" }} />
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col sm="12" md="6">
          <Card>
            <Card.Body>
              <Card.Title>Peso de Animales</Card.Title>
              <canvas id="pesoAnimalesChart" height="250"></canvas>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EstadisticasBovinoSmart;
