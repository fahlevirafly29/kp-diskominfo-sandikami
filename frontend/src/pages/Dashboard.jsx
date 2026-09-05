import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
} from 'recharts';

import {
  FileDown,
  Calendar,
  FilePlus,
  RefreshCcw,
  XOctagon,
  Loader2,
  Lightbulb,
  List,
  Database,
  AlertCircle,
} from 'lucide-react';

const STATUS_COLORS = {
  terbit: '#0B4A99',
  diperpanjang: '#16A34A',
  dicabut: '#D97706',
  dihentikan: '#DC2626',
};

const UI_COLORS = [
  '#0088CC',
  '#10b981',
  '#f97316',
  '#ef4444',
];

export default function Dashboard() {
  const [dataSertifikat, setDataSertifikat] = useState([]);

  const [summary, setSummary] = useState({
    terbit: 0,
    diperpanjang: 0,
    dicabut: 0,
    dihentikan: 0,
    total: 0,
  });

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const printRef = useRef(null);

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    if (startDate && endDate && startDate > endDate) {
      setErrorMessage(
        'Tanggal awal tidak boleh lebih besar dari tanggal akhir.'
      );
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      const params = {};

      if (startDate && endDate) {
        params.start_date = startDate;
        params.end_date = endDate;
      }

      const response = await axios.get('/api/sertifikat', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      const resultData = response.data?.data || [];

      setDataSertifikat(resultData);

      let totalTerbit = 0;
      let totalDiperpanjang = 0;
      let totalDicabut = 0;
      let totalDihentikan = 0;

      resultData.forEach((item) => {
        totalTerbit += Number(item.terbit_baru) || 0;
        totalDiperpanjang += Number(item.diperpanjang) || 0;
        totalDicabut += Number(item.dicabut) || 0;
        totalDihentikan += Number(item.dihentikan) || 0;
      });

      setSummary({
        terbit: totalTerbit,
        diperpanjang: totalDiperpanjang,
        dicabut: totalDicabut,
        dihentikan: totalDihentikan,
        total:
          totalTerbit +
          totalDiperpanjang +
          totalDicabut +
          totalDihentikan,
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Gagal mengambil data:', error);

      setErrorMessage(
        'Data tidak dapat dimuat. Periksa koneksi server atau layanan API.'
      );

      setDataSertifikat([]);

      setSummary({
        terbit: 0,
        diperpanjang: 0,
        dicabut: 0,
        dihentikan: 0,
        total: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatDateTime = (date) => {
    if (!date) return '-';

    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatTanggalGrafik = (tanggal) => {
    if (!tanggal) return '';

    const date = new Date(tanggal);

    if (Number.isNaN(date.getTime())) {
      return tanggal;
    }

    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  const getPeriodeLaporan = () => {
    if (!startDate || !endDate) {
      return 'Semua Waktu (Keseluruhan)';
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return '-';
    }

    if (
      start.toISOString().split('T')[0] ===
      end.toISOString().split('T')[0]
    ) {
      return formatDate(startDate);
    }

    return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  };

  const sortedData = [...dataSertifikat].sort(
    (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
  );

  const recentData = [...sortedData].reverse().slice(0, 5);

  let highestTerbit = 0;
  let highestDate = '-';

  sortedData.forEach((item) => {
    const value = Number(item.terbit_baru) || 0;

    if (value > highestTerbit) {
      highestTerbit = value;
      highestDate = item.tanggal;
    }
  });

  const persenTerbit =
    summary.total > 0
      ? ((summary.terbit / summary.total) * 100).toFixed(1)
      : '0';

  const komparasiData = [
    {
      name: 'Terbit Baru',
      jumlah: summary.terbit,
      colorPDF: STATUS_COLORS.terbit,
      colorUI: UI_COLORS[0],
    },
    {
      name: 'Diperpanjang',
      jumlah: summary.diperpanjang,
      colorPDF: STATUS_COLORS.diperpanjang,
      colorUI: UI_COLORS[1],
    },
    {
      name: 'Dicabut',
      jumlah: summary.dicabut,
      colorPDF: STATUS_COLORS.dicabut,
      colorUI: UI_COLORS[2],
    },
    {
      name: 'Dihentikan',
      jumlah: summary.dihentikan,
      colorPDF: STATUS_COLORS.dihentikan,
      colorUI: UI_COLORS[3],
    },
  ];

  const handleExportPDF = async () => {
    if (isExporting) return;

    try {
      setIsExporting(true);

      /*
       * html2pdf.js sengaja di-load secara dinamis.
       * Jadi file PDF yang besar tidak ikut dimuat
       * ketika Dashboard pertama kali dibuka.
       */
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;

      await new Promise((resolve) => setTimeout(resolve, 500));

      const element = printRef.current;

      const opt = {
        margin: 0,
        filename:
          startDate && endDate
            ? `Laporan_Sertifikat_${startDate}_sd_${endDate}.pdf`
            : 'Laporan_Sertifikat_Keseluruhan.pdf',

        image: {
          type: 'jpeg',
          quality: 0.98,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#FFFFFF',
          logging: false,
        },

        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },

        pagebreak: {
          mode: ['css', 'legacy'],
        },
      };

      await html2pdf()
        .set(opt)
        .from(element)
        .save();
    } catch (error) {
      console.error('Gagal export PDF:', error);

      alert('Gagal membuat laporan PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    return (
      <div className="bg-white border border-slate-200 rounded-md shadow-lg px-4 py-3 min-w-[190px]">
        <p className="text-xs font-semibold text-slate-700 pb-2 mb-2 border-b border-slate-100">
          {formatDate(label)}
        </p>

        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-5 text-xs mb-1.5"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor:
                    entry.color ||
                    entry.payload?.colorUI ||
                    entry.payload?.colorPDF ||
                    '#000',
                }}
              />

              <span className="text-slate-600">
                {entry.name}
              </span>
            </div>

            <span className="font-semibold text-slate-800">
              {Number(entry.value || 0).toLocaleString('id-ID')}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderCustomLegendUI = () => (
    <ul className="flex flex-wrap justify-center gap-4 text-[11px] text-slate-600 pt-2">
      {komparasiData.map((entry, index) => (
        <li
          key={`item-${index}`}
          className="flex items-center gap-1.5"
        >
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: entry.colorUI,
            }}
          />

          {entry.name}
        </li>
      ))}
    </ul>
  );

  const renderCustomLegendPDF = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        paddingTop: '10px',
      }}
    >
      {komparasiData.map((entry, index) => (
        <div
          key={`pdf-item-${index}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '10px',
            color: '#475569',
          }}
        >
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: entry.colorPDF,
            }}
          />

          {entry.name}
        </div>
      ))}
    </div>
  );

  const KpiCard = ({
    title,
    value,
    icon,
    iconClass,
    description,
  }) => (
    <div className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">
            {title}
          </p>

          <h3 className="text-2xl font-bold text-slate-800 leading-none">
            {value.toLocaleString('id-ID')}
          </h3>

          <p className="text-[11px] text-slate-400 mt-2">
            {description}
          </p>
        </div>

        <div className={`p-3 rounded-lg ${iconClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard Sertifikat Elektronik
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Pemanfaatan layanan sertifikat elektronik Pemerintah Kabupaten Garut
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={isExporting || isLoading}
          className="inline-flex items-center justify-center gap-2 bg-[#0B4A99] hover:bg-[#083670] disabled:bg-slate-300 text-white px-4 py-2.5 rounded-md text-sm font-semibold transition-colors"
        >
          {isExporting ? (
            <Loader2
              size={17}
              className="animate-spin"
            />
          ) : (
            <FileDown size={17} />
          )}

          {isExporting
            ? 'Menyiapkan laporan...'
            : 'Ekspor Laporan'}
        </button>
      </div>

      {/* FILTER PERIODE */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar
            size={18}
            className="text-[#0B4A99]"
          />

          <h2 className="text-sm font-semibold text-slate-800">
            Periode Data
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-[#0B4A99] transition-colors"
            />

            <span className="text-slate-400">
              –
            </span>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-[#0B4A99] transition-colors"
            />
          </div>

          <button
            onClick={fetchData}
            disabled={isLoading}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#0B4A99] hover:bg-[#083670] disabled:bg-slate-300 text-white px-5 py-1.5 rounded-md text-sm font-semibold transition-colors"
          >
            {isLoading ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : null}

            Terapkan
          </button>
        </div>
      </div>

      {/* LAST UPDATED */}
      <div className="flex items-center justify-end px-1">
        <p className="text-xs text-slate-400">
          Data diperbarui:{' '}
          <span className="font-medium text-slate-500">
            {formatDateTime(lastUpdated)}
          </span>
        </p>
      </div>

      {/* ERROR */}
      {errorMessage && (
        <div className="border border-red-200 bg-red-50 rounded-md px-4 py-3 flex items-center gap-3">
          <AlertCircle
            size={18}
            className="text-red-500"
          />

          <p className="text-sm text-red-700">
            {errorMessage}
          </p>
        </div>
      )}

      {/* KPI */}
      <div>
        <div className="mb-3">
          <h2 className="text-base font-semibold text-slate-800">
            Ikhtisar Statistik
          </h2>

          <p className="text-xs text-slate-500 mt-0.5">
            Rekapitulasi aktivitas sertifikat pada periode terpilih
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard
            title="Total Aktivitas"
            value={summary.total}
            description="Seluruh aktivitas tercatat"
            icon={
              <Database
                size={21}
                strokeWidth={1.8}
              />
            }
            iconClass="bg-slate-100 text-slate-600"
          />

          <KpiCard
            title="Terbit Baru"
            value={summary.terbit}
            description="Penerbitan sertifikat baru"
            icon={
              <FilePlus
                size={21}
                strokeWidth={1.8}
              />
            }
            iconClass="bg-blue-50 text-[#0088CC]"
          />

          <KpiCard
            title="Diperpanjang"
            value={summary.diperpanjang}
            description="Perpanjangan sertifikat"
            icon={
              <RefreshCcw
                size={21}
                strokeWidth={1.8}
              />
            }
            iconClass="bg-green-50 text-green-600"
          />

          <KpiCard
            title="Dihentikan"
            value={summary.dihentikan}
            description="Sertifikat dihentikan"
            icon={
              <XOctagon
                size={21}
                strokeWidth={1.8}
              />
            }
            iconClass="bg-red-50 text-red-600"
          />
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* TREND */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-800">
              Tren Pemanfaatan
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Perkembangan aktivitas sertifikat berdasarkan periode
            </p>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={sortedData}
                margin={{
                  top: 5,
                  right: 15,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="tanggal"
                  tickFormatter={formatTanggalGrafik}
                  tick={{
                    fill: '#64748B',
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: '#64748B',
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                />

                <Tooltip
                  content={<CustomTooltip />}
                />

                <Legend
                  verticalAlign="bottom"
                  height={30}
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: '11px',
                    color: '#475569',
                    paddingTop: '10px',
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="terbit_baru"
                  name="Terbit Baru"
                  stroke={UI_COLORS[0]}
                  strokeWidth={3}
                  dot={{
                    r: 3,
                    fill: '#FFFFFF',
                    stroke: UI_COLORS[0],
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />

                <Line
                  type="monotone"
                  dataKey="diperpanjang"
                  name="Diperpanjang"
                  stroke={UI_COLORS[1]}
                  strokeWidth={2}
                  dot={{
                    r: 2.5,
                    fill: '#FFFFFF',
                    stroke: UI_COLORS[1],
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />

                <Line
                  type="monotone"
                  dataKey="dicabut"
                  name="Dicabut"
                  stroke={UI_COLORS[2]}
                  strokeWidth={2}
                  dot={{
                    r: 2.5,
                    fill: '#FFFFFF',
                    stroke: UI_COLORS[2],
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />

                <Line
                  type="monotone"
                  dataKey="dihentikan"
                  name="Dihentikan"
                  stroke={UI_COLORS[3]}
                  strokeWidth={2}
                  dot={{
                    r: 2.5,
                    fill: '#FFFFFF',
                    stroke: UI_COLORS[3],
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* COMPARISON */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-800">
                Perbandingan Status
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Jumlah aktivitas berdasarkan status
              </p>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={komparasiData}
                margin={{
                  top: 5,
                  right: 15,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: '#64748B',
                    fontSize: 10,
                  }}
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: '#64748B',
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                />

                <Tooltip
                  cursor={{
                    fill: '#F8FAFC',
                  }}
                  content={<CustomTooltip />}
                />

                <Legend
                  content={renderCustomLegendUI}
                  verticalAlign="bottom"
                  height={30}
                />

                <Bar
                  dataKey="jumlah"
                  barSize={42}
                  radius={[5, 5, 0, 0]}
                >
                  {komparasiData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.colorUI}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* INSIGHT + TABLE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* INSIGHT */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-blue-50 text-[#0B4A99]">
              <Lightbulb size={19} />
            </div>

            <div>
              <h3 className="text-base font-semibold text-slate-800">
                Ikhtisar Pemanfaatan
              </h3>

              <p className="text-xs text-slate-500 mt-0.5">
                Ringkasan berdasarkan periode
              </p>
            </div>
          </div>

          {summary.total > 0 ? (
            <div className="space-y-4">

              <p className="text-sm text-slate-600 leading-relaxed">
                Pada periode{' '}
                <strong className="text-slate-800">
                  {getPeriodeLaporan()}
                </strong>
                , tercatat sebanyak{' '}
                <strong className="text-slate-800">
                  {summary.total.toLocaleString('id-ID')}
                </strong>{' '}
                aktivitas layanan sertifikat elektronik.
              </p>

              <div className="border-l-4 border-[#0B4A99] bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">
                  Aktivitas dominan
                </p>

                <p className="text-sm font-semibold text-slate-800">
                  Terbit Baru
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {summary.terbit.toLocaleString('id-ID')}{' '}
                  layanan ({persenTerbit}% dari total aktivitas)
                </p>
              </div>

              <div className="border-l-4 border-green-600 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">
                  Puncak penerbitan
                </p>

                <p className="text-sm font-semibold text-slate-800">
                  {formatDate(highestDate)}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {highestTerbit.toLocaleString('id-ID')}{' '}
                  layanan terbit baru
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <Database
                size={30}
                className="mx-auto text-slate-300 mb-3"
              />

              <p className="text-sm text-slate-500">
                Belum terdapat data pada periode yang dipilih.
              </p>
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">
                <List size={19} />
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-800">
                  Rekapitulasi Data Terbaru
                </h3>

                <p className="text-xs text-slate-500 mt-0.5">
                  Lima pencatatan terbaru pada periode terpilih
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-600">
                    Tanggal
                  </th>

                  <th className="py-3 px-4 text-right text-xs font-semibold text-slate-600">
                    Terbit Baru
                  </th>

                  <th className="py-3 px-4 text-right text-xs font-semibold text-slate-600">
                    Diperpanjang
                  </th>

                  <th className="py-3 px-4 text-right text-xs font-semibold text-slate-600">
                    Dicabut
                  </th>

                  <th className="py-3 px-4 text-right text-xs font-semibold text-slate-600">
                    Dihentikan
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-8 text-sm text-slate-400"
                    >
                      Belum ada data pada periode ini.
                    </td>
                  </tr>
                ) : (
                  recentData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {formatDate(item.tanggal)}
                      </td>

                      <td className="py-3 px-4 text-right text-slate-600">
                        {Number(
                          item.terbit_baru || 0
                        ).toLocaleString('id-ID')}
                      </td>

                      <td className="py-3 px-4 text-right text-slate-600">
                        {Number(
                          item.diperpanjang || 0
                        ).toLocaleString('id-ID')}
                      </td>

                      <td className="py-3 px-4 text-right text-slate-600">
                        {Number(
                          item.dicabut || 0
                        ).toLocaleString('id-ID')}
                      </td>

                      <td className="py-3 px-4 text-right text-slate-600">
                        {Number(
                          item.dihentikan || 0
                        ).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                )}

                <tr
                  style={{
                    backgroundColor: '#F1F5F9',
                    fontWeight: 'bold',
                  }}
                >
                  <td className="py-3 px-4 text-right text-slate-700">
                    TOTAL
                  </td>

                  <td className="py-3 px-4 text-right text-slate-700">
                    {summary.terbit}
                  </td>

                  <td className="py-3 px-4 text-right text-slate-700">
                    {summary.diperpanjang}
                  </td>

                  <td className="py-3 px-4 text-right text-slate-700">
                    {summary.dicabut}
                  </td>

                  <td className="py-3 px-4 text-right text-slate-700">
                    {summary.dihentikan}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* HIDDEN TEMPLATE PDF */}
      <div
        style={{
          position: 'absolute',
          top: '-10000px',
          left: '-10000px',
          width: '210mm',
        }}
      >
        <div
          ref={printRef}
          style={{
            width: '210mm',
            backgroundColor: '#FFFFFF',
            fontFamily: 'Arial, sans-serif',
            color: '#1E293B',
          }}
        >
          {/* HALAMAN 1 - COVER */}
          <div
            style={{
              width: '210mm',
              height: '296mm',
              boxSizing: 'border-box',
              backgroundColor: '#0B4A99',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
              padding: '100px 40px 70px',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '42px',
                  fontWeight: '700',
                  lineHeight: '1.2',
                  marginBottom: '20px',
                }}
              >
                LAPORAN
                <br />
                PEMANFAATAN LAYANAN
                <br />
                SERTIFIKAT ELEKTRONIK
              </h1>

              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: '400',
                }}
              >
                Pemerintah Kabupaten Garut
              </h3>
            </div>

            <div
              style={{
                backgroundColor: '#F59E0B',
                color: '#FFFFFF',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: '5px solid #FFFFFF',
              }}
            >
              <span
                style={{
                  fontSize: '17px',
                  marginBottom: '6px',
                }}
              >
                Periode
              </span>

              <span
                style={{
                  fontSize: '21px',
                  fontWeight: 'bold',
                  padding: '0 15px',
                  textAlign: 'center',
                }}
              >
                {getPeriodeLaporan()}
              </span>
            </div>

            <div>
              <h2
                style={{
                  fontSize: '17px',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  lineHeight: '1.5',
                }}
              >
                BIDANG PERSANDIAN DAN KEAMANAN INFORMASI
                <br />
                DINAS KOMUNIKASI DAN INFORMATIKA
              </h2>
            </div>
          </div>

          <div
            style={{
              pageBreakAfter: 'always',
            }}
          />

          {/* HALAMAN 2 - RINGKASAN & GRAFIK */}
          <div
            style={{
              width: '210mm',
              minHeight: '296mm',
              boxSizing: 'border-box',
              padding: '35px 40px',
              backgroundColor: '#FFFFFF',
            }}
          >
            <h2
              style={{
                fontSize: '23px',
                fontWeight: 'bold',
                margin: '0 0 5px',
              }}
            >
              Laporan Pemanfaatan Layanan Sertifikat Elektronik
            </h2>

            <p
              style={{
                fontSize: '13px',
                color: '#64748B',
                margin: '0 0 18px',
              }}
            >
              Periode: {getPeriodeLaporan()}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              {[
                ['Total Aktivitas', summary.total],
                ['Terbit Baru', summary.terbit],
                ['Diperpanjang', summary.diperpanjang],
                ['Dihentikan', summary.dihentikan],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '12px',
                    backgroundColor: '#F8FAFC',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: '9px',
                      color: '#64748B',
                    }}
                  >
                    {label}
                  </p>

                  <p
                    style={{
                      margin: '5px 0 0',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#1E293B',
                    }}
                  >
                    {value.toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                border: '1px solid #E2E8F0',
                borderLeft: '4px solid #0B4A99',
                backgroundColor: '#F8FAFC',
                padding: '12px 15px',
                marginBottom: '20px',
                fontSize: '11px',
                lineHeight: '1.6',
              }}
            >
              Berdasarkan data pada periode{' '}
              <strong>{getPeriodeLaporan()}</strong>, tercatat total{' '}
              <strong>
                {summary.total.toLocaleString('id-ID')}
              </strong>{' '}
              aktivitas layanan sertifikat elektronik.
              Aktivitas terbit baru mencapai{' '}
              <strong>
                {summary.terbit.toLocaleString('id-ID')}
              </strong>{' '}
              layanan atau <strong>{persenTerbit}%</strong> dari total
              aktivitas.
            </div>

            <h3
              style={{
                fontSize: '14px',
                margin: '0 0 8px',
                fontWeight: 'bold',
              }}
            >
              Tren Pemanfaatan
            </h3>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                marginBottom: '20px',
              }}
            >
              <LineChart
                width={680}
                height={250}
                data={sortedData}
                margin={{
                  top: 10,
                  right: 15,
                  left: 10,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="tanggal"
                  tickFormatter={formatTanggalGrafik}
                  tick={{
                    fill: '#64748B',
                    fontSize: 10,
                  }}
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: '#64748B',
                    fontSize: 10,
                  }}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                />

                <Legend
                  verticalAlign="bottom"
                  height={30}
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: '10px',
                    color: '#475569',
                    paddingTop: '10px',
                  }}
                />

                <Line
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="terbit_baru"
                  name="Terbit Baru"
                  stroke={STATUS_COLORS.terbit}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  connectNulls
                />

                <Line
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="diperpanjang"
                  name="Diperpanjang"
                  stroke={STATUS_COLORS.diperpanjang}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  connectNulls
                />

                <Line
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="dicabut"
                  name="Dicabut"
                  stroke={STATUS_COLORS.dicabut}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  connectNulls
                />

                <Line
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="dihentikan"
                  name="Dihentikan"
                  stroke={STATUS_COLORS.dihentikan}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  connectNulls
                />
              </LineChart>
            </div>

            <h3
              style={{
                fontSize: '14px',
                margin: '0 0 8px',
                fontWeight: 'bold',
              }}
            >
              Perbandingan Status
            </h3>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <BarChart
                width={680}
                height={250}
                data={komparasiData}
                margin={{
                  top: 10,
                  right: 15,
                  left: 10,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: '#64748B',
                    fontSize: 10,
                  }}
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: '#64748B',
                    fontSize: 10,
                  }}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                />

                <Legend
                  content={renderCustomLegendPDF}
                  verticalAlign="bottom"
                  height={30}
                />

                <Bar
                  isAnimationActive={false}
                  dataKey="jumlah"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                >
                  {komparasiData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.colorPDF}
                    />
                  ))}
                </Bar>
              </BarChart>
            </div>
          </div>

          <div
            style={{
              pageBreakAfter: 'always',
            }}
          />

          {/* HALAMAN 3 - TABEL */}
          <div
            style={{
              width: '210mm',
              minHeight: '296mm',
              boxSizing: 'border-box',
              padding: '40px',
              backgroundColor: '#FFFFFF',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: '0 0 5px',
              }}
            >
              Rekapitulasi Data
            </h2>

            <p
              style={{
                fontSize: '12px',
                color: '#64748B',
                margin: '0 0 20px',
              }}
            >
              Periode: {getPeriodeLaporan()}
            </p>

            <table
              style={{
                width: '100%',
                fontSize: '10px',
                borderCollapse: 'collapse',
                border: '1px solid #CBD5E1',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: '#E2E8F0',
                  }}
                >
                  <th
                    style={{
                      border: '1px solid #CBD5E1',
                      padding: '8px',
                      textAlign: 'left',
                    }}
                  >
                    Tanggal
                  </th>

                  <th
                    style={{
                      border: '1px solid #CBD5E1',
                      padding: '8px',
                      textAlign: 'center',
                    }}
                  >
                    Terbit Baru
                  </th>

                  <th
                    style={{
                      border: '1px solid #CBD5E1',
                      padding: '8px',
                      textAlign: 'center',
                    }}
                  >
                    Diperpanjang
                  </th>

                  <th
                    style={{
                      border: '1px solid #CBD5E1',
                      padding: '8px',
                      textAlign: 'center',
                    }}
                  >
                    Dicabut
                  </th>

                  <th
                    style={{
                      border: '1px solid #CBD5E1',
                      padding: '8px',
                      textAlign: 'center',
                    }}
                  >
                    Dihentikan
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedData.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        border: '1px solid #CBD5E1',
                        padding: '7px',
                      }}
                    >
                      {formatDate(item.tanggal)}
                    </td>

                    <td
                      style={{
                        border: '1px solid #CBD5E1',
                        padding: '7px',
                        textAlign: 'center',
                      }}
                    >
                      {Number(
                        item.terbit_baru || 0
                      ).toLocaleString('id-ID')}
                    </td>

                    <td
                      style={{
                        border: '1px solid #CBD5E1',
                        padding: '7px',
                        textAlign: 'center',
                      }}
                    >
                      {Number(
                        item.diperpanjang || 0
                      ).toLocaleString('id-ID')}
                    </td>

                    <td
                      style={{
                        border: '1px solid #CBD5E1',
                        padding: '7px',
                        textAlign: 'center',
                      }}
                    >
                      {Number(
                        item.dicabut || 0
                      ).toLocaleString('id-ID')}
                    </td>

                    <td
                      style={{
                        border: '1px solid #CBD5E1',
                        padding: '7px',
                        textAlign: 'center',
                      }}
                    >
                      {Number(
                        item.dihentikan || 0
                      ).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}

                <tr
                  style={{
                    backgroundColor: '#F1F5F9',
                    fontWeight: 'bold',
                  }}
                >
                  <td
                    style={{
                      border: '1px solid #CBD5E1',
                      padding: '8px',
                      textAlign: 'right',
                    }}
                  >
                    TOTAL
                  </td>

                  <td
                    style={{
                      border: '1px solid #CBD5E1',
                      padding: '8px',
                      textAlign: 'center',
                    }}
                  >
                    {summary.terbit}
                  </td>

                  <td
                    style={{
                      border: '1px solid #CBD5E1',
                      padding: '8px',
                      textAlign: 'center',
                    }}
                  >
                    {summary.diperpanjang}
                  </td>

                  <td
                    style={{
                      border: '1px solid #CBD5E1',
                      padding: '8px',
                      textAlign: 'center',
                    }}
                  >
                    {summary.dicabut}
                  </td>

                  <td
                    style={{
                      border: '1px solid #CBD5E1',
                      padding: '8px',
                      textAlign: 'center',
                    }}
                  >
                    {summary.dihentikan}
                  </td>
                </tr>
              </tbody>
            </table>

            <div
              style={{
                marginTop: '30px',
                paddingTop: '12px',
                borderTop: '1px solid #E2E8F0',
                fontSize: '9px',
                color: '#94A3B8',
                textAlign: 'center',
              }}
            >
              Laporan Pemanfaatan Layanan Sertifikat Elektronik
              <br />
              Bidang Persandian dan Keamanan Informasi – Diskominfo Kabupaten Garut
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}