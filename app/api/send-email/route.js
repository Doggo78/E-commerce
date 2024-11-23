// app/api/send-email/route.js
import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
  const { name, email, message } = await request.json();

  // Ruta directa al script de Python en el mismo nivel
  const scriptPath = path.resolve('./send_email.py'); // si está al mismo nivel, solo cambia a esta ruta
  const pythonProcess = spawn('python', [scriptPath, name, email, message]);

  // Capturar la salida del script Python
  pythonProcess.stdout.on('data', (data) => {
    console.log(`Output from Python script: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error from Python script: ${data}`);
  });

  // Promesa para manejar el cierre del proceso de Python
  return new Promise((resolve, reject) => {
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(new NextResponse(JSON.stringify({ success: true }), { status: 200 }));
      } else {
        reject(new NextResponse(JSON.stringify({ success: false, error: 'Python script failed' }), { status: 500 }));
      }
    });
  });
}
