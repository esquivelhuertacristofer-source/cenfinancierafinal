"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import {
  onboardEscuela,
  getEscuelas,
  type EscuelaOnboardEntry,
  type EscuelaOnboardResult,
  type EscuelaStats,
} from "@/app/actions/adminActions";
import {
  Building2,
  Users,
  BookOpen,
  Upload,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  GraduationCap,
  ChevronRight,
  LogOut,
  Plus,
} from "lucide-react";
import Papa from "papaparse";
import jsPDF from "jspdf";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ParsedRow extends EscuelaOnboardEntry {
  _idx: number;
  _valid: boolean;
  _error?: string;
}

const GRADOS_VALIDOS = ["P1","P2","P3","P4","P5","P6","S1","S2","S3"];
const CSV_TEMPLATE = `nombre_completo,grupo,grado,rol
Juan Pérez García,GRUPO-A,P4,alumno
María Elena Sánchez,GRUPO-A,P4,alumno
Carlos López Torres,GRUPO-A,P4,profesor
Ana García Ruiz,GRUPO-B,S2,alumno
Pedro Ramírez Cruz,GRUPO-B,S2,alumno
Sofía Mendoza,GRUPO-B,S2,profesor`;

// ─── Helpers PDF ─────────────────────────────────────────────────────────────

function generarPDFCredenciales(
  escuelaNombre: string,
  password: string,
  result: EscuelaOnboardResult
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 14;

  // Agrupar por grupo
  const byGroup: Record<string, typeof result.results> = {};
  for (const r of result.results) {
    const k = `${r.grupo} — ${r.grado}`;
    if (!byGroup[k]) byGroup[k] = [];
    byGroup[k].push(r);
  }

  let y = 0;

  const addPage = (first = false) => {
    if (!first) doc.addPage();
    // Header navy
    doc.setFillColor(1, 28, 64);
    doc.rect(0, 0, pageW, 38, "F");
    doc.setFillColor(255, 140, 0);
    doc.rect(0, 38, pageW, 2.5, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("CEN Financiera — Credenciales Institucionales", margin, 16);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Escuela: ${escuelaNombre}`, margin, 26);
    doc.text(`Contraseña del lote: ${password}`, margin, 33);
    doc.setTextColor(255, 140, 0);
    doc.text(`Generado: ${new Date().toLocaleDateString("es-MX")}`, pageW - margin, 33, { align: "right" });

    y = 50;
  };

  addPage(true);

  for (const [grupo, members] of Object.entries(byGroup)) {
    if (y > 250) addPage();

    // Sección grupo
    doc.setFillColor(240, 248, 255);
    doc.roundedRect(margin, y, pageW - margin * 2, 10, 2, 2, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(1, 28, 64);
    doc.text(grupo, margin + 4, y + 7);
    y += 14;

    // Profesores primero
    const teachers = members.filter((m) => m.rol === "teacher");
    const students = members.filter((m) => m.rol === "student");

    for (const person of [...teachers, ...students]) {
      if (y > 270) addPage();

      const isTeacher = person.rol === "teacher";
      if (isTeacher) {
        doc.setFillColor(255, 245, 235);
      } else {
        doc.setFillColor(250, 250, 250);
      }
      doc.roundedRect(margin, y, pageW - margin * 2, 13, 1.5, 1.5, "F");

      // Rol badge
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(isTeacher ? 180 : 100, isTeacher ? 80 : 120, isTeacher ? 0 : 180);
      doc.text(isTeacher ? "PROFESOR" : "ALUMNO", margin + 3, y + 5);

      // Nombre
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(person.name, margin + 3, y + 10.5);

      // Email
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(person.email, pageW / 2, y + 10.5);

      y += 15;
    }
    y += 4;
  }

  // Errores si hay
  if (result.errors.length > 0) {
    if (y > 250) addPage();
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 38, 38);
    doc.text(`Errores (${result.errors.length})`, margin, y + 7);
    y += 12;
    for (const err of result.errors) {
      if (y > 275) addPage();
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`• ${err.name}: ${err.mensaje}`, margin + 3, y);
      y += 7;
    }
  }

  // Footer en todas las páginas
  const pages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(200, 200, 200);
    doc.text("© 2026 CEN Financiera — Documento confidencial. No distribuir.", pageW / 2, 292, { align: "center" });
    doc.text(`Página ${i}/${pages}`, pageW - margin, 292, { align: "right" });
  }

  doc.save(`credenciales-${escuelaNombre.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`);
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function AdminEscuelasPage() {
  const router = useRouter();

  // Auth
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Form
  const [escuelaNombre, setEscuelaNombre] = useState("");
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [manualText, setManualText] = useState("");
  const [inputMode, setInputMode] = useState<"csv" | "manual">("csv");

  // Estado
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<EscuelaOnboardResult | null>(null);
  const [escuelas, setEscuelas] = useState<EscuelaStats[]>([]);
  const [loadingEscuelas, setLoadingEscuelas] = useState(true);

  const fileRef = useRef<HTMLInputElement>(null);

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/log-in"); return; }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (!profile || !["admin", "super_admin"].includes(profile.role)) {
        router.push("/");
        return;
      }
      setIsAdmin(true);
      setAuthLoading(false);
    };
    check();
  }, [router]);

  // ── Cargar escuelas existentes ────────────────────────────────────────────
  const cargarEscuelas = useCallback(async () => {
    setLoadingEscuelas(true);
    try {
      const data = await getEscuelas();
      setEscuelas(data);
    } finally {
      setLoadingEscuelas(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) cargarEscuelas();
  }, [isAdmin, cargarEscuelas]);

  // ── Parsear CSV ───────────────────────────────────────────────────────────
  const parseCSV = useCallback((text: string) => {
    const parsed = Papa.parse<Record<string, string>>(text.trim(), {
      header: true,
      skipEmptyLines: true,
    });

    const validadas: ParsedRow[] = parsed.data.map((row, idx) => {
      const nombre = (row["nombre_completo"] ?? row["nombre"] ?? "").trim();
      const grupo = (row["grupo"] ?? "").trim();
      const grado = (row["grado"] ?? "").trim().toUpperCase();
      const rolRaw = (row["rol"] ?? "alumno").trim().toLowerCase();
      const rol: "student" | "teacher" =
        rolRaw === "profesor" || rolRaw === "teacher" ? "teacher" : "student";

      const errors: string[] = [];
      if (!nombre) errors.push("nombre vacío");
      if (!grupo) errors.push("grupo vacío");
      if (!GRADOS_VALIDOS.includes(grado)) errors.push(`grado inválido (${grado})`);

      return { _idx: idx, _valid: errors.length === 0, _error: errors.join(", "), nombre, grupo, grado, rol };
    });

    setRows(validadas);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => parseCSV(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleManualParse = () => parseCSV(manualText);

  const handleDeleteRow = (idx: number) => setRows((prev) => prev.filter((r) => r._idx !== idx));

  // ── Enviar ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const validRows = rows.filter((r) => r._valid);
    if (!escuelaNombre.trim()) { alert("Ingresa el nombre de la escuela."); return; }
    if (!password || password.length < 8) { alert("La contraseña debe tener al menos 8 caracteres."); return; }
    if (validRows.length === 0) { alert("No hay filas válidas para procesar."); return; }

    setProcessing(true);
    setResult(null);
    try {
      const entries: EscuelaOnboardEntry[] = validRows.map(({ nombre, grupo, grado, rol }) => ({
        nombre, grupo, grado, rol,
      }));
      const res = await onboardEscuela(escuelaNombre, entries, password);
      setResult(res);
      await cargarEscuelas();
      // Limpiar formulario
      setEscuelaNombre("");
      setPassword("");
      setRows([]);
      setManualText("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!result) return;
    generarPDFCredenciales(result.escuelaNombre, password || "—", result);
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla-escuela.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/log-in");
  };

  // ── Stats del form ────────────────────────────────────────────────────────
  const validCount = rows.filter((r) => r._valid).length;
  const invalidCount = rows.filter((r) => !r._valid).length;
  const gruposDetectados = [...new Set(rows.filter((r) => r._valid).map((r) => `${r.grupo}||${r.grado}`))].length;
  const profesoresCount = rows.filter((r) => r._valid && r.rol === "teacher").length;
  const alumnosCount = rows.filter((r) => r._valid && r.rol === "student").length;

  // ─────────────────────────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#011C40] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#42E8E0] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] font-['Epilogue']">
      {/* TOPBAR */}
      <div className="bg-[#011C40] px-8 py-4 flex items-center justify-between shadow-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF8C00] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-xs font-black uppercase tracking-[0.3em]">CEN Financiera</p>
              <p className="text-white/30 text-[10px] font-medium">Panel de Administración</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-2xl p-1">
            <a
              href="/admin/usuarios"
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              Usuarios
            </a>
            <span className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-[#FF8C00]/20 border border-[#FF8C00]/30">
              Escuelas
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 text-xs font-black uppercase tracking-widest transition-all"
        >
          <LogOut className="w-4 h-4" /> Salir
        </button>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-12 space-y-12">
        {/* PAGE HEADER */}
        <div className="relative overflow-hidden rounded-[3rem] bg-[#011C40] p-14 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF8C00]/10 rounded-full blur-[100px]" />
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-[#42E8E0]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Alta Institucional</span>
              </div>
              <h1 className="text-6xl font-black text-white leading-none tracking-tighter">
                Dar de Alta <span className="text-[#FF8C00] italic">Escuela</span>
              </h1>
              <p className="text-white/40 text-base font-medium max-w-xl">
                Registra una escuela con todos sus grupos, profesores y alumnos en un solo paso.
                El sistema genera correo y contraseña para cada persona automáticamente.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto lg:min-w-[320px]">
              <div className="bg-white/5 rounded-[2rem] p-6 text-center border border-white/10">
                <p className="text-4xl font-black text-white">{escuelas.length}</p>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">Escuelas</p>
              </div>
              <div className="bg-white/5 rounded-[2rem] p-6 text-center border border-white/10">
                <p className="text-4xl font-black text-[#42E8E0]">
                  {escuelas.reduce((s, e) => s + e.alumnos_count, 0)}
                </p>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">Alumnos</p>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-10">

          {/* ── COLUMNA IZQUIERDA: Formulario ──────────────────────────── */}
          <div className="space-y-8">

            {/* Nombre + Contraseña */}
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-5 h-5 text-[#011C40]" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#011C40]">Datos de la Escuela</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre de la Escuela *</label>
                  <input
                    type="text"
                    value={escuelaNombre}
                    onChange={(e) => setEscuelaNombre(e.target.value)}
                    placeholder="Ej. Escuela Primaria Benito Juárez"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[#011C40] font-medium focus:border-[#FF8C00] focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contraseña del Lote *</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mín. 8 caracteres"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[#011C40] font-medium focus:border-[#FF8C00] focus:outline-none transition-colors"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">
                    Todos los usuarios del lote usarán esta contraseña para su primer acceso.
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de usuarios */}
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#011C40]" />
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#011C40]">Lista de Usuarios</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInputMode("csv")}
                    className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      inputMode === "csv"
                        ? "bg-[#011C40] text-white"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => setInputMode("manual")}
                    className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      inputMode === "manual"
                        ? "bg-[#011C40] text-white"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </div>

              {inputMode === "csv" ? (
                <div className="space-y-4">
                  <div
                    className="relative border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:border-[#FF8C00] transition-colors cursor-pointer group"
                    onClick={() => fileRef.current?.click()}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".csv,.txt"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Upload className="w-10 h-10 text-slate-300 group-hover:text-[#FF8C00] mx-auto mb-4 transition-colors" />
                    <p className="text-sm font-black text-slate-400 group-hover:text-[#011C40] transition-colors">
                      Arrastra o haz clic para subir CSV
                    </p>
                    <p className="text-xs text-slate-300 mt-2">
                      Columnas: nombre_completo, grupo, grado, rol
                    </p>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#FF8C00] hover:text-[#011C40] transition-colors"
                  >
                    <Download className="w-4 h-4" /> Descargar plantilla CSV
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-400">
                    Pega los datos con encabezados: <code className="bg-slate-100 px-2 py-0.5 rounded">nombre_completo,grupo,grado,rol</code>
                  </p>
                  <textarea
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    rows={10}
                    placeholder={CSV_TEMPLATE}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono text-slate-600 focus:border-[#FF8C00] focus:outline-none resize-none transition-colors"
                  />
                  <button
                    onClick={handleManualParse}
                    className="px-6 py-3 bg-[#011C40] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF8C00] transition-colors"
                  >
                    Analizar datos
                  </button>
                </div>
              )}
            </div>

            {/* Preview table */}
            {rows.length > 0 && (
              <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#011C40]" />
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#011C40]">
                      Vista Previa — {validCount} válidos
                      {invalidCount > 0 && (
                        <span className="text-red-500 ml-2">/ {invalidCount} con error</span>
                      )}
                    </h2>
                  </div>
                  {/* Stats rápidos */}
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      {gruposDetectados} grupo{gruposDetectados !== 1 ? "s" : ""}
                    </span>
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-black uppercase">
                      {profesoresCount} prof.
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase">
                      {alumnosCount} alumnos
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 w-8">#</th>
                        <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre</th>
                        <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Grupo</th>
                        <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Grado</th>
                        <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Rol</th>
                        <th className="text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                        <th className="w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr
                          key={row._idx}
                          className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${
                            !row._valid ? "bg-red-50/30" : ""
                          }`}
                        >
                          <td className="px-5 py-3 text-[10px] text-slate-300 font-bold">{row._idx + 1}</td>
                          <td className="px-5 py-3 font-bold text-[#011C40] text-xs">{row.nombre || "—"}</td>
                          <td className="px-5 py-3 text-xs text-slate-600">{row.grupo || "—"}</td>
                          <td className="px-5 py-3 text-xs text-slate-600">{row.grado || "—"}</td>
                          <td className="px-5 py-3">
                            <span
                              className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase ${
                                row.rol === "teacher"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {row.rol === "teacher" ? "Profesor" : "Alumno"}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            {row._valid ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                <span className="text-[10px] text-red-400 font-bold">{row._error}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <button
                              onClick={() => handleDeleteRow(row._idx)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Botón Crear */}
            <button
              onClick={handleSubmit}
              disabled={processing || validCount === 0 || !escuelaNombre || !password}
              className="w-full py-7 bg-[#011C40] text-white rounded-[2.5rem] font-black text-base uppercase tracking-[0.3em] hover:bg-[#FF8C00] transition-all shadow-xl active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-4"
            >
              {processing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Creando cuentas...
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6" />
                  Crear Escuela y Generar Cuentas
                  {validCount > 0 && (
                    <span className="px-3 py-1 bg-white/20 rounded-xl text-sm font-black">
                      {validCount}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>

          {/* ── COLUMNA DERECHA: Resultado + Escuelas ──────────────────── */}
          <div className="space-y-8">

            {/* Resultado */}
            {result && (
              <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-emerald-200 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-700">¡Escuela Creada!</h2>
                </div>
                <p className="text-2xl font-black text-[#011C40]">{result.escuelaNombre}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 rounded-2xl p-5 text-center">
                    <p className="text-3xl font-black text-emerald-700">{result.results.length}</p>
                    <p className="text-[10px] font-black uppercase text-emerald-600 mt-1">Cuentas creadas</p>
                  </div>
                  <div className="bg-red-50 rounded-2xl p-5 text-center">
                    <p className="text-3xl font-black text-red-500">{result.errors.length}</p>
                    <p className="text-[10px] font-black uppercase text-red-400 mt-1">Errores</p>
                  </div>
                </div>
                {result.errors.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-red-400">Errores:</p>
                    {result.errors.map((e, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-red-500">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span><strong>{e.name}:</strong> {e.mensaje}</span>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={handleDownloadPDF}
                  className="w-full py-5 bg-[#011C40] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-[#FF8C00] transition-all flex items-center justify-center gap-3"
                >
                  <Download className="w-5 h-5" />
                  Descargar PDF con Credenciales
                </button>
              </div>
            )}

            {/* Instrucciones */}
            <div className="bg-[#011C40] rounded-[3rem] p-10 space-y-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-[#42E8E0]" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/60">Cómo funciona</h2>
              </div>
              <div className="space-y-5">
                {[
                  { step: "1", text: "Escribe el nombre de la escuela y define una contraseña para el lote." },
                  { step: "2", text: 'Sube el CSV con columnas: nombre_completo, grupo, grado, rol (alumno/profesor).' },
                  { step: "3", text: "El sistema crea grupos, vincula profesores y genera correo institucional para cada persona." },
                  { step: "4", text: "Descarga el PDF con todos los accesos para entregar a la escuela." },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-[#FF8C00] flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                      {step}
                    </div>
                    <p className="text-white/50 text-sm font-medium leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Grados válidos</p>
                <div className="flex flex-wrap gap-2">
                  {GRADOS_VALIDOS.map((g) => (
                    <span key={g} className="px-3 py-1 bg-white/5 border border-white/10 text-white/50 rounded-xl text-[10px] font-black">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Lista de escuelas */}
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 space-y-6">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-[#011C40]" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#011C40]">Escuelas Registradas</h2>
              </div>

              {loadingEscuelas ? (
                <div className="flex flex-col items-center py-8 gap-3">
                  <Loader2 className="w-8 h-8 text-[#011C40] animate-spin" />
                </div>
              ) : escuelas.length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <Building2 className="w-10 h-10 text-slate-200 mx-auto" />
                  <p className="text-sm text-slate-400 font-medium">Aún no hay escuelas registradas.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {escuelas.map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#FF8C00]/30 transition-all group"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-black text-[#011C40]">{e.nombre}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-slate-400">
                            {e.grupos_count} grupo{e.grupos_count !== 1 ? "s" : ""}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[10px] font-bold text-slate-400">
                            {e.alumnos_count} alumno{e.alumnos_count !== 1 ? "s" : ""}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[10px] font-bold text-slate-400">
                            {new Date(e.created_at).toLocaleDateString("es-MX")}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#FF8C00] transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
