import autoTable from 'jspdf-autotable';
import fs from 'fs';
import jsPDF from 'jspdf';
import logger from './utils/logger';
import path from 'path';
import translate from './translate';
import { app, dialog } from 'electron';
import { generateDateTime } from './utils/utils';
import { NavigationResult } from './interfaces/navigation-result';

export function exportReport(jsonData: string): void {
  const defaultPath = app.getPath('downloads');
  const results: NavigationResult[] = JSON.parse(jsonData);
  const doc = generateDocument(results);
  const name = generateDateTime();
  dialog
    .showSaveDialog({
      title: name,
      defaultPath: path.join(defaultPath, `${name}.pdf`),
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    })
    .then((fileName) => {
      if (fileName && fileName.filePath.length > 0) {
        savePdfFile(fileName.filePath, doc);
      }
    });
}

export function savePdfFile(filePath: string, doc: jsPDF): void {
  try {
    fs.writeFileSync(filePath, Buffer.from(doc.output('arraybuffer')));
    logger.info('Arquivo salvo com sucesso em:', filePath);
  } catch (error) {
    logger.error('Erro ao salvar arquivo:', error);
  }
}

function generateDocument(results: NavigationResult[]): jsPDF {
  const doc = createPDF();
  addTestResults(doc, results);
  addSummaryInfo(doc, results);
  addFooter(doc);
  return doc;
}

function createPDF(): jsPDF {
  const t = translate.global.t;
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(t('resultTestTitle'), 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  return doc;
}

function addTestResults(doc: jsPDF, results: NavigationResult[]): void {
  const t = translate.global.t;
  const resultsData = results.map((result) => [
    result.title,
    result.message,
    result.duration || '',
    result.error || t('passedReport'),
  ]);
  autoTable(doc, {
    startY: 35,
    headStyles: {
      fillColor: [128, 128, 128],
    },
    columnStyles: { 0: { halign: 'center' } },
    head: [[t('actionReport'), t('contextReport'), t('durationTimeReport'), t('statusReport')]],
    body: resultsData,
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 3) {
        const raw = (data.row.raw as any)[data.column.index];
        data.cell.styles.textColor = raw === t('passedReport') ? 'green' : 'red';
      }
    },
  });
}

function addSummaryInfo(doc: jsPDF, results: NavigationResult[]): void {
  const t = translate.global.t;
  const totalDuration = results.reduce((total, result) => {
    if (typeof result.duration === 'number') {
      return total + result.duration;
    }
    return total;
  }, 0);
  const finalY = (doc as any).lastAutoTable.finalY;
  doc.text(t('totalTimeReport', [totalDuration.toFixed(2)]), 14, finalY + 10);
  const totalTests = results.length;
  const totalPassedTests = calculatePassedTests(results);
  const testsPassedColor = totalPassedTests === totalTests ? 'green' : 'red';
  doc.setTextColor(testsPassedColor);
  doc.text(t('passedTest', [totalPassedTests, totalTests]), 14, finalY + 20);
  doc.setTextColor(100);
  const currentDate = new Date().toLocaleString();
  doc.text(t('exportDate', [currentDate]), 14, finalY + 30);
}

function calculatePassedTests(results: NavigationResult[]): number {
  return results.filter((result) => result.error === undefined).length;
}

function addFooter(doc: jsPDF): void {
  const t = translate.global.t;
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setFontSize(10);
    doc.setPage(i);
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    doc.text(t('pageReport', [i, pageCount]), 10, pageHeight - 8);
    doc.text(`Browse Buddy ${new Date().getFullYear()}`, pageSize.width - 40, pageHeight - 8);
  }
}
