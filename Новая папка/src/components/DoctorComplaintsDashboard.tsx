import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  FlaskConical,
  ShieldCheck,
  Send,
  Download,
  Building,
  HeartPulse,
  ChevronRight,
  Filter,
  Paperclip
} from 'lucide-react';

export type InvestigationStep = 
  | 'submitted'
  | 'under_investigation'
  | 'sample_transit'
  | 'lab_testing'
  | 'closed';

export interface TimelineEntry {
  step: InvestigationStep;
  title: string;
  date: string;
  description: string;
  author: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface ComplaintDetail {
  id: string;
  createdAt: string;
  productName: string;
  lotNumber: string;
  serialNumber?: string;
  sku: string;
  organization: string;
  severity: 'minor' | 'moderate' | 'critical' | 'fatal';
  currentStep: InvestigationStep;
  statusLabel: string;
  patientAnonCode: string;
  incidentType: string;
  summary: string;
  assignedEngineer: {
    name: string;
    role: string;
    phone: string;
    email: string;
  };
  timeline: TimelineEntry[];
  attachments: { name: string; size: string; url: string }[];
}

const MOCK_COMPLAINTS: ComplaintDetail[] = [
  {
    id: 'REC-2026-0042',
    createdAt: '18.10.2026',
    productName: 'Механический клапан сердца «МедИнж-2»',
    sku: 'MI-2-21-A (Посадочный ø 21 мм)',
    lotNumber: 'L-2609-04',
    serialNumber: 'SN-84920',
    organization: 'ФГБУ «ФЦССХ» Минздрава России (г. Пенза)',
    severity: 'critical',
    currentStep: 'lab_testing',
    statusLabel: 'Лабораторная экспертиза',
    patientAnonCode: 'ИБ-4821/26',
    incidentType: 'Интраоперационное затруднение хода створки',
    summary: 'При калибровке и позиционировании клапана отмечено ограничение экскурсии правой створки в крайнем верхнем положении. Изделие заменено на резервное до вшивания.',
    assignedEngineer: {
      name: 'Соколов Дмитрий Евгеньевич',
      role: 'Ведущий инженер службы качества (СМК / CAPA)',
      phone: '+7 (8412) 59-00-00 (доб. 142)',
      email: 'qa-investigation@medinzh.ru'
    },
    timeline: [
      {
        step: 'submitted',
        title: 'Регистрация извещения',
        date: '18.10.2026 14:20',
        description: 'Обращение зарегистрировано в единой системе CAPA, наложен превентивный карантин на складские остатки партии L-2609-04.',
        author: 'Автоматическая система СМК',
        isCompleted: true,
        isCurrent: false
      },
      {
        step: 'under_investigation',
        title: 'Первичный анализ комиссии',
        date: '19.10.2026 09:40',
        description: 'Техническая комиссия изучила протокол операции и фотофиксацию. Направлен запрос на изъятие и доставку образца в испытательную лабораторию завода.',
        author: 'Соколов Д. Е. (СМК)',
        isCompleted: true,
        isCurrent: false
      },
      {
        step: 'sample_transit',
        title: 'Забор и доставка образца',
        date: '19.10.2026 17:10',
        description: 'Специальная курьерская служба завода приняла образец и акт деконтаминации в клинике. Доставлено в чистую зону лаборатории завода МедИнж.',
        author: 'Логистическая служба завода',
        isCompleted: true,
        isCurrent: false
      },
      {
        step: 'lab_testing',
        title: 'Лабораторная экспертиза',
        date: 'В процессе (с 20.10.2026)',
        description: 'Проводится профилометрия элементов пироуглеродного корпуса под микроскопом, проверка зазоров в шарнире и тест на гидродинамическом стенде пульсирующего потока.',
        author: 'Испытательная лаборатория R&D',
        isCompleted: false,
        isCurrent: true
      },
      {
        step: 'closed',
        title: 'Формирование заключения и CAPA',
        date: 'Ожидается до 23.10.2026',
        description: 'Оформление акта технической экспертизы, уведомление Росздравнадзора по форме приказа № 961н и принятие предупреждающих мер.',
        author: 'Дирекция по качеству',
        isCompleted: false,
        isCurrent: false
      }
    ],
    attachments: [
      { name: 'Акт_изъятия_и_деконтаминации.pdf', size: '1.4 МБ', url: '#' },
      { name: 'Макрофото_створки_операционная.jpg', size: '4.8 МБ', url: '#' },
      { name: 'Протокол_операции_ИБ-4821.pdf', size: '820 КБ', url: '#' }
    ]
  },
  {
    id: 'REC-2026-0038',
    createdAt: '02.10.2026',
    productName: 'Эндоваскулярный стент-графт аортальный',
    sku: 'SG-T-32-160 (Торакальный)',
    lotNumber: 'L-2608-11',
    organization: 'ФГБУ «НМИЦ им. ак. Е.Н. Мешалкина»',
    severity: 'minor',
    currentStep: 'closed',
    statusLabel: 'Дело закрыто (Акт выдан)',
    patientAnonCode: 'ИБ-1904/26',
    incidentType: 'Повреждение внешнего блистера упаковки',
    summary: 'При приемке в операционную обнаружен микронадрыв внешней стерильной упаковки. Изделие возвращено производителю, герметичность нарушена при транспортировке.',
    assignedEngineer: {
      name: 'Волкова Елена Михайловна',
      role: 'Инженер входного и выходного контроля',
      phone: '+7 (8412) 59-00-00 (доб. 118)',
      email: 'e.volkova@medinzh.ru'
    },
    timeline: [
      {
        step: 'submitted',
        title: 'Регистрация',
        date: '02.10.2026',
        description: 'Обращение зарегистрировано.',
        author: 'СМК',
        isCompleted: true,
        isCurrent: false
      },
      {
        step: 'closed',
        title: 'Экспертиза завершена',
        date: '05.10.2026',
        description: 'Подтверждено транспортное сдавливание внешнего короба. Произведена плановая замена изделия. Логистический регламент доработан.',
        author: 'Дирекция по качеству',
        isCompleted: true,
        isCurrent: false
      }
    ],
    attachments: [
      { name: 'Заключение_комиссии_СМК_№038.pdf', size: '2.1 МБ', url: '#' }
    ]
  }
];

export const DoctorComplaintsDashboard: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(MOCK_COMPLAINTS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [doctorMessage, setDoctorMessage] = useState('');
  const [messagesList, setMessagesList] = useState<{ sender: string; time: string; text: string }[]>([
    {
      sender: 'Соколов Д. Е. (Инженер СМК)',
      time: '19.10.2026 10:15',
      text: 'Здравствуйте! Образец благополучно доставлен в Пензу на завод. Приступаем к микроскопическому анализу шарнирного узла. Держим вас в курсе.'
    }
  ]);

  const activeComplaint = MOCK_COMPLAINTS.find((c) => c.id === selectedId) || MOCK_COMPLAINTS[0];

  const filteredComplaints = MOCK_COMPLAINTS.filter((c) => {
    const matchesSearch = 
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || c.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorMessage.trim()) return;
    setMessagesList((prev) => [
      ...prev,
      {
        sender: 'Вы (Хирург)',
        time: 'Только что',
        text: doctorMessage.trim()
      }
    ]);
    setDoctorMessage('');
  };

  const getSeverityBadge = (severity: ComplaintDetail['severity']) => {
    switch (severity) {
      case 'critical':
      case 'fatal':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Критический инцидент</span>;
      case 'moderate':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Умеренный</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Без вреда</span>;
    }
  };

  const getStepIcon = (step: InvestigationStep, isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    if (isCurrent) return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />;
    
    switch (step) {
      case 'sample_transit':
        return <Truck className="w-4 h-4 text-slate-400" />;
      case 'lab_testing':
        return <FlaskConical className="w-4 h-4 text-slate-400" />;
      case 'closed':
        return <ShieldCheck className="w-4 h-4 text-slate-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:px-8 bg-slate-50 min-h-screen text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 text-blue-700 mb-1">
            <HeartPulse className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Портал специалиста • Мониторинг безопасности</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Реестр рекламаций и нежелательных событий</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Отслеживание статусов заводских расследований (СМК по ГОСТ ISO 13485)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Поиск по № дела, партии или названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Фильтр:</span>
              <button
                onClick={() => setFilterSeverity('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${filterSeverity === 'all' ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Все
              </button>
              <button
                onClick={() => setFilterSeverity('critical')}
                className={`px-2.5 py-1 rounded-md transition-colors ${filterSeverity === 'critical' ? 'bg-red-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Критические
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredComplaints.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-blue-600 shadow-md ring-2 ring-blue-50'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {item.id}
                    </span>
                    <span className="text-xs text-slate-400">{item.createdAt}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-1 mb-1">
                    {item.productName}
                  </h3>

                  <div className="text-xs text-slate-500 space-y-0.5 mb-3">
                    <p>Партия: <span className="font-mono font-medium text-slate-700">{item.lotNumber}</span> • {item.sku}</p>
                    <p className="line-clamp-1 italic text-slate-600">«{item.incidentType}»</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    {getSeverityBadge(item.severity)}
                    <div className="flex items-center text-xs font-medium text-slate-600 gap-1">
                      <span>{item.statusLabel}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 font-mono">{activeComplaint.id}</h2>
                    {getSeverityBadge(activeComplaint.severity)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" /> {activeComplaint.organization}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-medium text-slate-500 block">Код пациента (152-ФЗ):</span>
                  <span className="font-mono text-sm font-bold text-slate-800">{activeComplaint.patientAnonCode}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 mt-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Изделие:</span>
                  <span className="font-medium text-slate-800">{activeComplaint.productName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Партия (Lot):</span>
                  <span className="font-mono font-medium text-slate-800">{activeComplaint.lotNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Типоразмер:</span>
                  <span className="font-medium text-slate-800">{activeComplaint.sku}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Серийный номер:</span>
                  <span className="font-mono font-medium text-slate-800">{activeComplaint.serialNumber || 'Не присвоен'}</span>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Обстоятельства инцидента:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {activeComplaint.summary}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> 
                Ход заводского расследования (СМК)
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeComplaint.timeline.map((event, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-6 top-0.5 flex items-center justify-center bg-white rounded-full ring-4 ring-white">
                      {getStepIcon(event.step, event.isCompleted, event.isCurrent)}
                    </div>

                    <div className={`p-3.5 rounded-xl border transition-all ${
                      event.isCurrent 
                        ? 'border-blue-400 bg-blue-50/40 ring-2 ring-blue-50' 
                        : event.isCompleted 
                        ? 'border-slate-200 bg-white' 
                        : 'border-slate-100 bg-slate-50/50 opacity-60'
                    }`}>
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <span className={`text-xs font-bold ${event.isCurrent ? 'text-blue-700' : 'text-slate-800'}`}>
                          {event.title}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{event.date}</span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-2">
                        {event.description}
                      </p>

                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <span>Ответственный:</span>
                        <span className="font-medium text-slate-600">{event.author}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {activeComplaint.attachments.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5" /> Прикрепленные материалы и акты ({activeComplaint.attachments.length}):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeComplaint.attachments.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="font-medium truncate text-slate-700">{file.name}</span>
                      </div>
                      <button 
                        onClick={() => alert(`Скачивание файла: ${file.name}`)}
                        className="p-1 hover:text-blue-600 text-slate-400 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800">
                  Прямой канал связи с инженером качества:
                </span>
                <span className="text-[11px] text-slate-500">
                  {activeComplaint.assignedEngineer.name}
                </span>
              </div>

              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto pr-1">
                {messagesList.map((msg, i) => (
                  <div key={i} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs shadow-2xs">
                    <div className="flex justify-between text-slate-400 text-[10px] mb-1">
                      <span className="font-semibold text-slate-700">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Задать вопрос инженеру или предоставить уточнения..."
                  value={doctorMessage}
                  onChange={(e) => setDoctorMessage(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
