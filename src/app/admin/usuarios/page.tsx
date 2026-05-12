"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users, Upload, CheckCircle2, AlertCircle, Loader2,
  Download, ClipboardList, Trash2, ShieldAlert, LogOut,
  PlusCircle, ChevronRight, FileSpreadsheet, X, Eye,
} from "lucide-react";
import { supabase } from "@/lib/supabase-browser";
import {
  onboardInstitutionalUsers,
  createGrupo,
  getGrupos,
} from "../../actions/adminActions";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import Papa from "papaparse";

interface Grupo { id: string; nombre: string; grado: string }
interface ImportRow {
  nombre_completo: string;
  grado_override?: string;
  email_personal?: string;
  valid: boolean;
  error?: string;
}

const GRADOS = ["P1","P2","P3","P4","P5","P6","S1","S2","S3"];
const MAX_IMPORT_ROWS = 200;

export default function AdminUsuariosPage() {
  const router = useRouter();
  const [authorized, setAuthorized]     = useState(false);
  const [checking,   setChecking]       = useState(true);
  const [adminName,  setAdminName]      = useState("");

  // Form state
  const [namesText,       setNamesText]       = useState("");
  const [selectedGroup,   setSelectedGroup]   = useState("");
  const [newGroupName,    setNewGroupName]     = useState("");
  const [creatingGroup,   setCreatingGroup]   = useState(false);
  const [grado,           setGrado]           = useState("P4");
  const [role,            setRole]            = useState<"student"|"teacher">("student");
  const [password,        setPassword]        = useState("");
  const [grupos,          setGrupos]          = useState<Grupo[]>([]);
  const [processing,      setProcessing]      = useState(false);
  const [results,         setResults]         = useState<{ success: {name:string;email:string}[]; errors: {name:string;message:string}[] } | null>(null);

  // Import state
  const [importRows,      setImportRows]      = useState<ImportRow[]>([]);
  const [dragActive,      setDragActive]      = useState(false);
  const [importFileName,  setImportFileName]  = useState("");

  // ── Guardia de seguridad ──────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/log-in"); return; }

      const { data: profile } = await supabase
        .from("profiles").select("role, full_name").eq("id", user.id).single();

      if (!profile || profile.role !== "admin") {
        await supabase.auth.signOut();
        router.replace("/log-in");
        return;
      }

      setAdminName(profile.full_name ?? "Administrador");
      setAuthorized(true);
      setChecking(false);

      const data = await getGrupos();
      setGrupos(data);
    })();
  }, [router]);

  const refreshGrupos = useCallback(async () => {
    const data = await getGrupos();
    setGrupos(data);
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    setCreatingGroup(true);
    try {
      await createGrupo(newGroupName.trim(), grado, null);
      setNewGroupName("");
      await refreshGrupos();
    } catch (e: any) {
      alert(`Error creando grupo: ${e.message}`);
    } finally {
      setCreatingGroup(false);
    }
  };

  const normalizeHeader = (h: string) =>
    h.toLowerCase().replace(/[^a-z_]/g, '').replace(/\s+/g, '_');

  const parseRawRows = (rawRows: Record<string, string>[]) => {
    const rows: ImportRow[] = rawRows.slice(0, MAX_IMPORT_ROWS).map(row => {
      const keys = Object.keys(row);
      // Find nombre_completo column (flexible matching)
      const nameKey = keys.find(k =>
        ['nombre_completo','nombre','name','full_name','alumno'].includes(normalizeHeader(k))
      );
      const gradoKey = keys.find(k => normalizeHeader(k) === 'grado');
      const emailKey = keys.find(k => ['email_personal','email'].includes(normalizeHeader(k)));

      const nombre = nameKey ? String(row[nameKey]).trim() : '';
      if (!nombre || nombre.split(' ').length < 2) {
        return { nombre_completo: nombre || '(vacío)', valid: false, error: 'Nombre incompleto (mínimo 2 palabras)' };
      }
      return {
        nombre_completo: nombre,
        grado_override: gradoKey ? String(row[gradoKey]).trim() : undefined,
        email_personal: emailKey ? String(row[emailKey]).trim() : undefined,
        valid: true,
      };
    });
    return rows;
  };

  const processFile = (file: File) => {
    setImportFileName(file.name);
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const data = new Uint8Array(ev.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rawRows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: '' });
        setImportRows(parseRawRows(rawRows));
      };
      reader.readAsArrayBuffer(file);
    } else {
      Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => setImportRows(parseRawRows(results.data)),
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const applyImport = () => {
    const validNames = importRows.filter(r => r.valid).map(r => r.nombre_completo);
    setNamesText(prev => {
      const existing = prev.trim();
      return existing ? `${existing}\n${validNames.join('\n')}` : validNames.join('\n');
    });
    setImportRows([]);
    setImportFileName('');
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['nombre_completo', 'grado', 'email_personal'],
      ['Juan Pérez García', 'P4', ''],
      ['María Elena Sánchez', 'P4', ''],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Alumnos');
    XLSX.writeFile(wb, 'plantilla-alumnos-cen.xlsx');
  };

  const handleProcess = async () => {
    const names = namesText.split("\n").map(n => n.trim()).filter(Boolean);
    if (!names.length) return alert("Escribe o pega al menos un nombre.");
    if (role === "student" && !selectedGroup) return alert("Selecciona un grupo de destino.");
    if (!password || password.length < 8) return alert("La contraseña debe tener al menos 8 caracteres.");

    setProcessing(true);
    try {
      const res = await onboardInstitutionalUsers(names, selectedGroup || null, role, grado, password);
      setResults(res);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const downloadPDF = () => {
    if (!results) return;
    const doc = new jsPDF();
    const groupName = grupos.find(g => g.id === selectedGroup)?.nombre ?? "Sin Grupo";
    const fecha = new Date().toLocaleDateString("es-MX");

    // Header navy
    doc.setFillColor(1, 28, 64);
    doc.rect(0, 0, 210, 38, "F");
    doc.setFillColor(255, 140, 0);
    doc.rect(0, 36, 210, 4, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("CEN Educación Financiera", 12, 16);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Credenciales de Acceso Institucional", 12, 25);
    doc.text(`Grupo: ${groupName}  |  Grado: ${grado}  |  ${fecha}`, 12, 33);

    // Tabla header
    doc.setTextColor(1, 28, 64);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("NOMBRE COMPLETO", 12, 52);
    doc.text("CORREO INSTITUCIONAL", 95, 52);
    doc.text("CONTRASEÑA", 165, 52);
    doc.setDrawColor(200, 200, 200);
    doc.line(12, 55, 198, 55);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    let y = 62;
    results.success.forEach((u, i) => {
      if (y > 272) { doc.addPage(); y = 20; }
      if (i % 2 === 0) {
        doc.setFillColor(248, 249, 250);
        doc.rect(10, y - 5, 190, 9, "F");
      }
      doc.setTextColor(1, 28, 64);
      doc.text(u.name.substring(0, 45), 12, y);
      doc.text(u.email.substring(0, 45), 95, y);
      doc.setTextColor(255, 140, 0);
      doc.text(password, 165, y);
      doc.setTextColor(1, 28, 64);
      y += 9;
    });

    if (results.errors.length > 0) {
      y += 6;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(220, 38, 38);
      doc.text(`Errores (${results.errors.length}):`, 12, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      results.errors.forEach(e => {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.text(`• ${e.name}: ${e.message}`, 14, y);
        y += 6;
      });
    }

    // Footer
    const pages = (doc.internal as any).getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setFontSize(7);
      doc.setTextColor(150);
      doc.text("La contraseña fue definida por el administrador para este lote. Entregue este documento de forma segura.", 12, 288);
      doc.text(`Pág. ${p} / ${pages}`, 190, 288, { align: "right" });
    }

    doc.save(`Credenciales_${groupName}_${grado}_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (checking) return (
    <div className="min-h-screen bg-[#011C40] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="w-12 h-12 border-4 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
        <p className="font-bold">Verificando acceso de administrador...</p>
      </div>
    </div>
  );

  if (!authorized) return null;

  const namesCount = namesText.split("\n").filter(n => n.trim()).length;

  return (
    <div className="min-h-screen bg-[#F4F1EA] font-['Epilogue',sans-serif]">

      {/* Topbar */}
      <div className="bg-[#011C40] px-8 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-[#FF8C00] rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-black text-sm">Panel de Administración — CEN Financiera</p>
            <p className="text-white/40 text-xs">Bienvenido, {adminName} · Acceso Restringido</p>
          </div>
        </div>
        <button
          onClick={async () => { await supabase.auth.signOut(); router.push("/log-in"); }}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold"
        >
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#011C40] mb-1 tracking-tight">Fábrica de Usuarios</h1>
          <p className="text-[#011C40]/50 font-medium">Pega una lista de nombres o sube un CSV y el sistema generará las cuentas automáticamente.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Izquierda */}
          <div className="lg:col-span-8 space-y-6">

            {/* Configuración */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm">
              <h2 className="font-black text-[#011C40] text-lg mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FF8C00]" /> Configuración del Lote
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">

                {/* Grupo existente */}
                <div>
                  <label className="block text-xs font-black uppercase text-[#011C40]/40 mb-2">Grupo de Destino</label>
                  <select
                    value={selectedGroup}
                    onChange={e => setSelectedGroup(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-[#011C40] focus:ring-2 focus:ring-[#FF8C00] outline-none"
                  >
                    <option value="">-- Sin grupo (Profesores) --</option>
                    {grupos.map(g => (
                      <option key={g.id} value={g.id}>{g.nombre} ({g.grado})</option>
                    ))}
                  </select>
                </div>

                {/* Crear nuevo grupo inline */}
                <div>
                  <label className="block text-xs font-black uppercase text-[#011C40]/40 mb-2">Crear Nuevo Grupo</label>
                  <div className="flex gap-2">
                    <input
                      value={newGroupName}
                      onChange={e => setNewGroupName(e.target.value)}
                      placeholder="Ej: GRUPO-FINANCIERA-001"
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-[#011C40] focus:ring-2 focus:ring-[#42E8E0] outline-none text-sm"
                    />
                    <button
                      onClick={handleCreateGroup}
                      disabled={!newGroupName.trim() || creatingGroup}
                      className="px-4 py-3 bg-[#011C40] text-white rounded-xl font-black hover:bg-[#042a5e] transition-all disabled:opacity-40"
                    >
                      {creatingGroup ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Grado */}
                <div>
                  <label className="block text-xs font-black uppercase text-[#011C40]/40 mb-2">Grado</label>
                  <select
                    value={grado}
                    onChange={e => setGrado(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-[#011C40] focus:ring-2 focus:ring-[#FF8C00] outline-none"
                  >
                    {GRADOS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                {/* Rol */}
                <div>
                  <label className="block text-xs font-black uppercase text-[#011C40]/40 mb-2">Rol</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-[#011C40] focus:ring-2 focus:ring-[#FF8C00] outline-none"
                  >
                    <option value="student">Alumno</option>
                    <option value="teacher">Profesor</option>
                  </select>
                </div>

                {/* Contraseña */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black uppercase text-[#011C40]/40 mb-2">Contraseña del Lote <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-[#011C40] focus:ring-2 focus:ring-[#FF8C00] outline-none"
                  />
                </div>
              </div>

              {/* Importar Excel / CSV */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase text-[#011C40]/40">Importar desde archivo</p>
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-[#FF8C00] hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar plantilla .xlsx
                  </button>
                </div>

                <div
                  onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${dragActive ? 'border-[#FF8C00] bg-[#FF8C00]/5' : 'border-gray-200 bg-gray-50 hover:border-[#011C40]/30'}`}
                >
                  <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileInput} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  <FileSpreadsheet className="w-8 h-8 text-[#011C40]/20 mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#011C40]/50">
                    {importFileName ? importFileName : 'Arrastra un .xlsx o .csv aquí'}
                  </p>
                  <p className="text-[10px] text-[#011C40]/30 mt-1">o haz clic para seleccionar · máx. {MAX_IMPORT_ROWS} filas</p>
                </div>

                {/* Preview table */}
                {importRows.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#011C40]/60">
                        <span className="text-emerald-600 font-black">{importRows.filter(r => r.valid).length} válidos</span>
                        {importRows.filter(r => !r.valid).length > 0 && (
                          <span className="text-red-500 font-black ml-2">{importRows.filter(r => !r.valid).length} con error</span>
                        )}
                        {' '}— {importRows.length} filas totales
                      </p>
                      <button onClick={() => { setImportRows([]); setImportFileName(''); }} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="rounded-2xl border border-gray-100 overflow-hidden max-h-52 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-[#011C40] text-white sticky top-0">
                          <tr>
                            <th className="text-left px-3 py-2 font-black text-[9px] uppercase tracking-wide">Estado</th>
                            <th className="text-left px-3 py-2 font-black text-[9px] uppercase tracking-wide">Nombre Completo</th>
                            <th className="text-left px-3 py-2 font-black text-[9px] uppercase tracking-wide hidden sm:table-cell">Grado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {importRows.map((row, i) => (
                            <tr key={i} className={`border-t border-gray-50 ${row.valid ? '' : 'bg-red-50'}`}>
                              <td className="px-3 py-1.5">
                                {row.valid
                                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  : <AlertCircle className="w-3.5 h-3.5 text-red-500" aria-label={row.error} />}
                              </td>
                              <td className="px-3 py-1.5 font-medium text-[#011C40]">
                                {row.nombre_completo}
                                {!row.valid && <span className="ml-2 text-red-400 text-[9px]">{row.error}</span>}
                              </td>
                              <td className="px-3 py-1.5 text-[#011C40]/40 hidden sm:table-cell">{row.grado_override || grado}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <button
                      onClick={applyImport}
                      disabled={importRows.filter(r => r.valid).length === 0}
                      className="w-full py-3 bg-[#011C40] text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#042a5e] transition-all disabled:opacity-40"
                    >
                      <Eye className="w-4 h-4" /> Aplicar {importRows.filter(r => r.valid).length} nombres válidos
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Lista de nombres */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-[#011C40] flex items-center gap-2 text-lg">
                  <ClipboardList className="w-5 h-5 text-[#FF8C00]" />
                  Lista de nombres (uno por línea)
                </h2>
                {namesText && (
                  <button onClick={() => { setNamesText(""); setResults(null); }} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              <textarea
                value={namesText}
                onChange={e => setNamesText(e.target.value)}
                placeholder={"Juan Pérez García\nMaría Elena Sánchez\nRoberto Carlos Ruiz\n..."}
                className="w-full h-64 bg-gray-50 rounded-2xl p-6 font-mono text-sm text-[#011C40] outline-none focus:ring-2 focus:ring-[#FF8C00] border border-gray-100 resize-none"
              />
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-[#011C40]/40 font-medium">
                  {namesCount > 0 ? `${namesCount} nombre${namesCount > 1 ? "s" : ""} detectado${namesCount > 1 ? "s" : ""}` : "Sin nombres aún"}
                </p>
                <button
                  onClick={handleProcess}
                  disabled={processing || !namesText.trim()}
                  className="px-8 py-4 bg-[#FF8C00] hover:bg-[#e07800] text-white font-black rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center gap-3 disabled:opacity-40"
                >
                  {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  {processing ? "Creando cuentas..." : "Generar Cuentas"}
                </button>
              </div>
            </div>
          </div>

          {/* Derecha */}
          <div className="lg:col-span-4 space-y-6">

            {/* Resultados */}
            {results && (
              <div className="bg-[#011C40] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-400/30">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl">¡Alta Completada!</h3>
                      <p className="text-white/50 text-xs">{results.success.length} cuentas creadas</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 p-4 bg-white/5 rounded-2xl">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Exitosas</span>
                      <span className="font-black text-emerald-400">{results.success.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Con error</span>
                      <span className="font-black text-red-400">{results.errors.length}</span>
                    </div>
                    {results.errors.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {results.errors.map((e, i) => (
                          <p key={i} className="text-[10px] text-red-300/80 flex items-start gap-1">
                            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            {e.name}: {e.message}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={downloadPDF}
                    className="w-full py-4 bg-[#FF8C00] hover:bg-[#e07800] text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all"
                  >
                    <Download className="w-5 h-5" /> Descargar PDF de Accesos
                  </button>
                </div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#FF8C00] opacity-10 blur-3xl rounded-full" />
              </div>
            )}

            {/* Instrucciones */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm">
              <h3 className="font-black text-[#011C40] mb-5 flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-[#42E8E0]" /> Instrucciones
              </h3>
              <div className="space-y-4">
                {[
                  ["1", "Crea o selecciona el Grupo de destino."],
                  ["2", "Elige el Grado, Rol y define la contraseña del lote."],
                  ["3", "Importa un .xlsx/.csv con la columna nombre_completo (descarga la plantilla), o pega los nombres manualmente."],
                  ["4", "Revisa la previsualización y aplica los nombres válidos."],
                  ["5", "Haz clic en Generar Cuentas y espera."],
                  ["6", "Descarga el PDF con credenciales para entregar a la escuela."],
                ].map(([n, t]) => (
                  <div key={n} className="flex gap-3">
                    <div className="h-7 w-7 rounded-full bg-[#FF8C00]/10 text-[#FF8C00] flex items-center justify-center font-black text-xs flex-shrink-0">{n}</div>
                    <p className="text-xs text-[#011C40]/60 font-medium pt-0.5">{t}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-[10px] text-[#011C40]/40 font-medium">
                  <strong>Dominio:</strong> @cenfinanciera.com<br />
                  <strong>Contraseña:</strong> Definida por lote, no se almacena en el PDF.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
